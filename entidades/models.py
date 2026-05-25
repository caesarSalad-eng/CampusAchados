from django.db import models
from django.urls import reverse

class Aluno(models.Model):

    usuario = models.CharField('Usuário', max_length = 100, null = False)
    matricula = models.IntegerField('Matrícula', unique = True, on_delete = models.CASCADE)
    curso = models.CharField('Curso' ,max_length = 100)
    telefone = models.IntegerField('Telefone' ,max_length = 15, unique = True)

class Item(models.Model):

    SITUACAO_ITEM = [
        ('perdido', 'Perdido'),
        ('encontrado', 'Encontrado'),
    ]

    STATUS_ITEM = [
        ('ativo', 'Ativo'),
        ('reivindicado', 'Reivindicado'),
        ('entregue', 'Entregue'),
    ]

    LOCAL_ENCONTRADO = [ 
        ('biblioteca', 'Biblioteca'),
        ('cantina', 'Cantina'),
        ('laboratorio', 'Laboratório'),
        ('sala_aula', 'Sala de Aula'),
        ('estacionamento', 'Estacionamento'),
        ('banheiro', 'Banheiro'),
        ('outro', 'Outro'),
        
        ]

    nome = models.CharField('Nome do item encontrado', max_length = 50)
    descricao = models.TextField('Descrição do item encontrado')
    local = models.CharField('Local onde o item foi encontrado', max_length = 20, choices = LOCAL_ENCONTRADO)
    situacao_Item = models.CharField(max_length =20, choices = SITUACAO_ITEM)
    status_Item = models.CharField(max_length = 20, choices = STATUS_ITEM)
    foto = models.ImageField('Imagem do item encontrado', upload_to ='itens/' ,blank = True, null = True)
    data_encontro = models.DateField('Data em que o item foi encontrado')
    data_criacao = models.DateTimeField(auto_now_add = True)
    cadastrado_por = models.ForeignKey()





