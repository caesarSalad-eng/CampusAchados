from django.shortcuts import render, get_object_or_404, redirect
from .models import Aluno, Item, Reivindicacao
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import ItemForm, ReivindicacaoForm
from django.contrib.auth.decorators import login_required
import json
from google import genai
from google.genai import types
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST


CURSOS = [
    "Ciência da Computação", "Engenharia de Software",
    "Sistemas de Informação", "Engenharia Elétrica",
    "Engenharia Civil", "Administração", "Matemática", "Física", "Outro",
]


def home(request):
    itens_perdidos = Item.objects.filter(status_Item='ativo')[:6]
    aluno = None
    if request.user.is_authenticated:
        aluno = Aluno.objects.filter(usuario=request.user).first()
    return render(request, 'entidades/home.html', {
        'itens_perdidos': itens_perdidos,
        'aluno': aluno,
    })

def login_view(request):
    if request.user.is_authenticated:
        return redirect('entidades:home')

    if request.method == 'POST':
        usuario = request.POST.get('usuario')
        senha = request.POST.get('senha')

        user = authenticate(request, username=usuario, password=senha)

        if user:
            login(request, user)
            messages.success(request, 'Bem Vindo!!')
            return redirect('entidades:home')
        else:
            messages.error(request, 'Usuário ou Senha incorretos')

    return render(request, 'entidades/login.html')

def logout_view(request):
    logout(request)
    messages.info(request, 'Você saiu da sua Conta')
    return redirect('entidades:login')

def lista_itensPerdidos(request):
    busca = request.GET.get('q', '')
    situacao = request.GET.get('situacao', '')
    local = request.GET.get('local', '')

    itens = Item.objects.filter(status_Item='ativo')

    if busca:
        itens = itens.filter(nome__icontains=busca)
    if situacao:
        itens = itens.filter(situacao_Item=situacao)
    if local:
        itens = itens.filter(local=local)

    contexto = {
        'itens': itens,
        'busca': busca,
        'situacao': situacao,
        'local': local,
    }

    return render(request, 'entidades/lista_itens.html', contexto)

def detalhe_item(request, pk):
    item = get_object_or_404(Item, pk=pk)
    contexto = {'item': item}
    return render(request, 'entidades/detalhe_item.html', contexto)

@login_required
def cadastrar_item(request):
    if request.method == 'POST':
        forms = ItemForm(request.POST, request.FILES)

        if forms.is_valid():
            item = forms.save(commit=False)
            item.cadastrado_por = request.user
            item.save()
            messages.success(request, 'Item cadastrado com sucesso')
            return redirect('entidades:detalhe_item', pk=item.pk)
        else:
            print("ERROS DO FORM:", forms.errors)
            messages.error(request, 'Dados inválidos. Tente novamente')
    else:
        forms = ItemForm()

    return render(request, 'entidades/forms_item.html', {'forms': forms, 'acao': 'Cadastrar'})

@login_required
def editar_item(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if item.cadastrado_por != request.user and not request.user.is_staff:
        messages.error(request, 'Você não tem permissão para editar esse item')
        return redirect('entidades:detalhe_item', pk=pk)

    if request.method == 'POST':
        forms = ItemForm(request.POST, request.FILES, instance=item)

        if forms.is_valid():
            forms.save()
            messages.success(request, 'Item atualizado')
            return redirect('entidades:detalhe_item', pk=item.pk)
        else:
            messages.error(request, 'Dados inválidos. Tente novamente')
    else:
        forms = ItemForm(instance=item)

    return render(request, 'entidades/forms_item.html', {'forms': forms, 'acao': 'Editar'})

@login_required
def excluir_item(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if item.cadastrado_por != request.user and not request.user.is_staff:
        messages.error(request, 'Você não tem permissão para excluir esse item')
        return redirect('entidades:detalhe_item', pk=pk)

    if request.method == 'POST':
        item.delete()
        messages.success(request, 'Item excluído com sucesso')
        return redirect('entidades:lista_itens')

    return render(request, 'entidades/confirma_exclusao.html', {'item': item})

@login_required
def reivindicar_item(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if item.cadastrado_por == request.user:
        messages.error(request, 'Você não pode reivindicar um item que você mesmo cadastrou.')
        return redirect('entidades:detalhe_item', pk=pk)

    if hasattr(item, 'reivindicacao'):
        messages.warning(request, 'Este item já possui uma reivindicação pendente.')
        return redirect('entidades:detalhe_item', pk=pk)

    if request.method == 'POST':
        form = ReivindicacaoForm(request.POST, request.FILES)

        if form.is_valid():
            reiv = form.save(commit=False)
            reiv.item = item
            reiv.requerente = request.user
            reiv.save()
            item.status_Item = 'reivindicado'
            item.save()
            messages.success(request, 'Reivindicação enviada! Aguarde a confirmação.')
            return redirect('entidades:detalhe_item', pk=pk)
    else:
        form = ReivindicacaoForm()

    return render(request, 'entidades/reivindicar.html', {'form': form, 'item': item})
from django.contrib.auth.forms import UserCreationForm

@login_required
def perfil_view(request):
    try:
        aluno = Aluno.objects.get(usuario=request.user)
    except Aluno.DoesNotExist:
        aluno = None  

    
    if request.method == 'POST':
        nome      = request.POST.get('nome', '').strip()
        email     = request.POST.get('email', '')
        telefone  = request.POST.get('telefone', '')
        matricula = request.POST.get('matricula', '')
        curso     = request.POST.get('curso', '')
        avatar    = request.POST.get('avatar', '🧑‍💻')
        bio       = request.POST.get('bio', '')

        # Validação server-side
        erros = False
        if not nome:             messages.error(request, 'Nome obrigatório.'); erros = True
        if '@' not in email:     messages.error(request, 'E-mail inválido.'); erros = True
        if not matricula:        messages.error(request, 'Matrícula obrigatória.'); erros = True

        if not erros:
            partes = nome.split()
            request.user.first_name = partes[0]
            request.user.last_name  = ' '.join(partes[1:])
            request.user.email      = email
            request.user.save()

            if aluno is None:
                aluno = Aluno(usuario=request.user)

            aluno.telefone  = telefone
            aluno.matricula = matricula
            aluno.curso     = curso
            aluno.avatar    = avatar
            aluno.bio       = bio
            aluno.save()

            messages.success(request, 'Perfil atualizado com sucesso!')
            return redirect('entidades:perfil')

    return render(request, 'entidades/perfil.html', {
        'aluno': aluno,
        'cursos': CURSOS,
    })

def cadastro_view(request):
    if request.user.is_authenticated:
        return redirect('entidades:home')

    if request.method == 'POST':
        nome     = request.POST.get('name', '').strip()
        email    = request.POST.get('email', '')
        password = request.POST.get('password', '')
        confirm  = request.POST.get('confirm', '')

        # Validação server-side (segurança)
        erros = {}
        if not nome:              erros['name']     = 'Informe seu nome.'
        if '@' not in email:      erros['email']    = 'E-mail inválido.'
        if len(password) < 8:     erros['password'] = 'Mínimo de 8 caracteres.'
        if password != confirm:   erros['confirm']  = 'As senhas não coincidem.'

        if not erros:
            if User.objects.filter(username=email).exists():
                messages.error(request, 'Este e-mail já está cadastrado.')
            else:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=nome.split()[0],
                    last_name=' '.join(nome.split()[1:]),
                )
                login(request, user)
                messages.success(request, 'Conta criada com sucesso! Bem-vindo(a)!')
                return redirect('entidades:home')

    return render(request, 'entidades/cadastro.html')

@require_POST
def chatbot_view(request):
    try:
        data = json.loads(request.body)
        historico = data.get('historico', [])
        mensagem = data.get('mensagem', '').strip()

        if not mensagem:
            return JsonResponse({'erro': 'Mensagem vazia'}, status=400)

        genai.configure(api_key=settings.GEMINI_API_KEY)

        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction="""Você é o assistente virtual do CampusAchados,
            um sistema universitário de itens perdidos e achados.
            Ajude os usuários com dúvidas sobre:
            - Como cadastrar um item encontrado
            - Como reivindicar um item perdido
            - Como funciona o processo de confirmação
            - Dúvidas gerais sobre o sistema
            Seja simpático, objetivo e fale em português brasileiro."""
        )

        # Converte histórico para o formato do Gemini
        historico_gemini = []
        for msg in historico:
            role = 'user' if msg['role'] == 'user' else 'model'
            historico_gemini.append({'role': role, 'parts': [msg['content']]})

        chat = model.start_chat(history=historico_gemini)
        resposta = chat.send_message(mensagem)

        return JsonResponse({'resposta': resposta.text})

    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=500)

@require_POST
def chatbot_view(request):
    try:
        data = json.loads(request.body)
        mensagem = data.get('mensagem', '').strip().lower()

        if not mensagem:
            return JsonResponse({'erro': 'Mensagem vazia'}, status=400)

        resposta = encontrar_resposta(mensagem)
        return JsonResponse({'resposta': resposta})

    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=500)


def encontrar_resposta(mensagem):
    from fuzzywuzzy import fuzz

    base_conhecimento = [
        {
            'perguntas': [
                'como cadastrar um item',
                'quero cadastrar um item',
                'como registrar um item encontrado',
                'como adicionar um item',
                'cadastrar item novo',
            ],
            'resposta': '📝 Para cadastrar um item, clique em "+ Cadastrar" no menu superior. Preencha o nome, descrição, local onde foi encontrado e uma foto (opcional). Após salvar, o item ficará visível para todos os usuários.'
        },
        {
            'perguntas': [
                'como reivindicar um item',
                'quero reivindicar um item',
                'como pegar um item perdido',
                'como solicitar devolução',
                'o item é meu como faço',
            ],
            'resposta': '🙋 Para reivindicar um item, acesse a página do item e clique em "Reivindicar". Você precisará descrever uma prova de que o item é seu. O responsável pelo cadastro poderá aprovar ou recusar.'
        },
        {
            'perguntas': [
                'perdi um item',
                'como achar meu item perdido',
                'como buscar item perdido',
                'procurar item no campus',
                'sumiço de item',
            ],
            'resposta': '🔍 Acesse a lista de itens e use os filtros de busca por nome, local e situação. Se encontrar o seu item, clique em "Reivindicar" para solicitar a devolução.'
        },
        {
            'perguntas': [
                'encontrei um item',
                'achei um objeto no campus',
                'quero devolver item encontrado',
                'como reportar item achado',
            ],
            'resposta': '✅ Que ótimo! Clique em "+ Cadastrar" e selecione a situação como "Encontrado". Descreva o item e o local onde foi achado para que o dono possa identificá-lo.'
        },
        {
            'perguntas': [
                'quais os status do item',
                'o que significa ativo',
                'o que significa reivindicado',
                'o que significa entregue',
                'situação do item',
            ],
            'resposta': '📊 Os itens possuem 3 status:\n• Ativo: disponível, aguardando o dono\n• Reivindicado: alguém solicitou o item\n• Entregue: item devolvido ao dono'
        },
        {
            'perguntas': [
                'como aprovar reivindicação',
                'como confirmar entrega',
                'como recusar reivindicação',
                'aprovar ou recusar pedido',
            ],
            'resposta': '✔️ Quem cadastrou o item pode aprovar ou recusar uma reivindicação. Acesse o item e analise a prova enviada pelo requerente antes de decidir.'
        },
        {
            'perguntas': [
                'como criar uma conta',
                'como me cadastrar no site',
                'como fazer login',
                'esqueci minha senha',
                'como entrar no sistema',
            ],
            'resposta': '👤 Para criar uma conta clique em "Entrar" e depois em "Criar conta". Use seu e-mail e uma senha com pelo menos 8 caracteres. Para entrar, use seu e-mail e senha cadastrados.'
        },
        {
            'perguntas': [
                'como editar meu perfil',
                'como mudar meu avatar',
                'como atualizar meus dados',
                'onde fica meu perfil',
                'como alterar meu nome',
            ],
            'resposta': '⚙️ Para editar seu perfil, clique no seu nome no menu superior. Lá você pode alterar nome, e-mail, matrícula, curso e escolher um avatar emoji.'
        },
        {
            'perguntas': [
                'como editar um item',
                'como alterar informações do item',
                'modificar item cadastrado',
            ],
            'resposta': '✏️ Você pode editar apenas os itens que cadastrou. Acesse o item e clique em "Editar" para modificar as informações.'
        },
        {
            'perguntas': [
                'como excluir um item',
                'como deletar um item',
                'remover item cadastrado',
                'apagar item',
            ],
            'resposta': '🗑️ Você pode excluir apenas os itens que cadastrou. Acesse o item e clique em "Excluir". Essa ação não pode ser desfeita.'
        },
        {
            'perguntas': [
                'olá',
                'oi',
                'bom dia',
                'boa tarde',
                'boa noite',
                'hello',
                'hey',
            ],
            'resposta': '👋 Olá! Sou o assistente do CampusAchados. Posso te ajudar com dúvidas sobre cadastrar itens, reivindicar, editar perfil e muito mais. O que você precisa?'
        },
        {
            'perguntas': [
                'obrigado',
                'obrigada',
                'valeu',
                'muito obrigado',
                'agradeço',
            ],
            'resposta': '😊 De nada! Se tiver mais alguma dúvida é só perguntar!'
        },
        {
            'perguntas': [
                'como funciona o site',
                'o que é o campusachados',
                'para que serve esse sistema',
                'me explica o sistema',
            ],
            'resposta': '🎓 O CampusAchados é um sistema para registrar e encontrar itens perdidos no campus. Você pode cadastrar itens que encontrou, buscar itens que perdeu e reivindicar a devolução. Use o menu superior para navegar!'
        },
    ]

    melhor_score = 0
    melhor_resposta = None

    for item in base_conhecimento:
        for pergunta in item['perguntas']:
            score = fuzz.partial_ratio(mensagem, pergunta)
            if score > melhor_score:
                melhor_score = score
                melhor_resposta = item['resposta']

    if melhor_score >= 55:
        return melhor_resposta

    return '🤔 Não entendi bem sua dúvida. Tente perguntar sobre: cadastrar item, reivindicar, status, perfil, login ou como funciona o site.'