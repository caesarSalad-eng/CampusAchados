from django.shortcuts import render, get_object_or_404, redirect
from .models import Aluno, Item, Reivindicacao
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from .forms import ItemForm, ReivindicacaoForm
from django.contrib.auth.decorators import login_required

def home(request):

    itens_perdidos = Item.objects.filter(status = "ativo")[:6]
    contexto = {'itens_perdidos': itens_perdidos}
    return render(request, "", contexto)

def login(request):

    if request.user.is_authenticated:

        return redirect('home')
    
    if request.method == 'POST':

        usuario = request.POST.get('usuario')
        senha = request.POST.get('senha')
        
        usuario = authenticate(request, usuario = usuario, senha = senha)

        if usuario:

            login(request, usuario)
            messages.success(request, 'Bem Vindo!!')

            return redirect('home')
        
        else:

            messages.error(request, 'Usuário ou Senha incorretos')

            return render(request, 'entidades/login.html')
        
def logout(request):

    logout(request)

    messages.info(request, 'Você saiu da sua Conta')

    return redirect('login')



def lista_itensPerdidos(request):

    busca = request.GET.get('q', '')
    situacao = request.GET.get('situacao', '')
    local = request.GET.get('local', '')

    itens = Item.objects.filter(status = 'ativo')

    if busca:
        itens = itens.filter(nome__icontains = busca)
    if situacao:
        itens = itens.filter(situacao = situacao)
    if local:
        itens = itens.filter(local = local)

    contexto = {

        'itens': itens,
        'busca': busca,
        'situacao': situacao,
        'local': local

    }

    return render(request, '', contexto)

def detalhe_item(request, pk):

    item = get_object_or_404(Item, pk=pk)

    contexto = {'item': item}

    return render(request, '', contexto)

def cadastrar_item(request):

    if request.method == 'POST':

        forms = ItemForm(request.POST, request.FILES)

        if forms.is_valid():

            item = forms.save(commit = False)
            item.cadastrado_por = request.user
            item.save()
            messages.success(request, 'Item cadastrado com sucesso')
            
            return redirect('', pk = item.pk)
        
        else:

            messages.error(request, 'Dados inválidos. Tente novamente')
    
    else:

        forms = ItemForm()

    return render(request, '', {'forms': forms, 'acao': 'Cadastrar'})

@login_required
def editar_item(request, pk):

    item = get_object_or_404(Item, pk = pk)

    if item.cadastrado_por != request.user and not request.user.is_staff:

        messages.error(request, 'Você não tem permissão para editar esse item')

        return redirect('detalhe_item', pk = pk)
    
    if request.method == 'POST':

            forms = ItemForm(request.POST, request.FILES, instance = item)

            if forms.is_valid():

                forms.save()

                messages.success(request, 'Item atualizado')

                return redirect(request, 'detalhe_item', pk = item.pk)
            
            else:

                messages.error(request, 'Dados inválidos. Tente novamente')
    else:

        forms = ItemForm(instance = item)

    return render(request, 'entidades/forms_item.html', {'forms': forms, 'acao': 'Editar'})

@login_required
def excluir_item(request, pk):

    item = get_object_or_404(Item, pk = pk)

    if item.cadastrado_por != request.user and not request.user.is_staff:

        messages.error(request, 'Você não tem permissão para editar esse item')

        return redirect('detalhe_item', pk = pk)
    
    if request.method == 'POST':

        item.delete()

        messages.success(request, 'Item excluido com sucesso')

        return redirect('lista_itens')
    
    return render(request, 'entidades/confirma_exclusao.html', {'item': item})

@login_required
def reivindicar_item(request, pk):

    item = get_object_or_404(Item, pk = pk)

    if item.cadastrado_por == request.user:
        
        messages.error(request, 'Você não pode reivindicar um item que você mesmo cadastrou.')
        
        return redirect('detalhe_item', pk = pk)
    
    if hasattr(item, 'reivindicacao'):

        messages.warning(request, 'Este item já possui uma reivindicação pendente.')

        return redirect('detalhe_item', pk = pk)
    
    if request.method == 'POST':

        form = ReivindicacaoForm(request.POST, request.FILES)

        if form.is_valid():

            reiv = form.save(commit=False)

            reiv.item = item

            reiv.requerente = request.user

            reiv.save()

            item.status = 'reivindicado'

            item.save()

            messages.success(request, 'Reivindicação enviada! Aguarde a confirmação.')

            return redirect('detalhe_item', pk = pk)
    else:

        form = ReivindicacaoForm()

    return render(request, 'entidades/reivindicar.html', {'form': form, 'item': item})

        