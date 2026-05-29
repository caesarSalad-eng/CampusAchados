from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Aluno, Item, Reivindicacao

def home(request):

    return HttpResponse("<h1><p>Olá! Bem vindo a página inicial</p>")

def login(request):

    itensPerdidos = Item.objects.filter(status = "ativo")[:6]
    contexto = {'itens Perdidos': itensPerdidos}
    return render(request, "", contexto)

def lista_itensPerdidos(request):

    busca = request.GET.get('q', '')
    lista_itensPerdidos = Item.objects.filter(status = "ativo")
        