from django import forms
from .models import Item, Reivindicacao

class ItemForm(forms.ModelForm):

    class Meta:
        model = Item
        fields = [
            'nome',
            'descricao',
            'local',
            'situacao_Item',
            'status_Item',
            'foto',
            'data_encontro',
        ]

class ReivindicacaoForm(forms.ModelForm):

    class Meta:
        model = Reivindicacao
        fields = [
            'descricao_prova',
        ]