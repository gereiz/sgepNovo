<style>

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .company-logo {
        width: 150px;
    }

    .company-info {
        text-align: center;
        flex-grow: 1;
        padding: 0 20px;
    }

    .company-info p {
        margin: 0;
        line-height: 1.4;
    }

    .pi-number {
        color: red;
        font-size: 24px;
        font-weight: bold;
    }

    .title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>

<table class="table table-bordered mb-4" style="border: 1px solid #666666;">
    <tr style="border: 1px solid #666666;">
        <td class="align-middle" style="width: 20%; border: 1px solid #666666;">
            <img src="{{public_path('storage/img/logo.png')}}" alt="Logo" style="width: 150px;">
        </td>
        <td class="text-center align-middle" style="width: 60%; border: 1px solid #666666; padding: 5px;">
            <p style="margin: 0; line-height: 1.2; font-size: 14px;">EQUIPE COMUNICAÇÃO LTDA - RUA OLEGÁRIO MACIEL, 922 - CENTRO</p>
            <p style="margin: 0; line-height: 1.2; font-size: 14px;">TEL (33) 3271-1040 / (33) 98802-0526</p>
            <p style="margin: 0; line-height: 1.2; font-size: 14px;">CEP - 35010-200 - contato@equipepropaganda.com.br - Governador Valadares - MG</p>
            <p style="margin: 0; line-height: 1.2; font-size: 14px;">CNPJ - 02.777.922/0001-35 - Insc Municipal: 038-537-7 - Insc Estadual: Isenta</p>
            <p class="title" style="margin: 5px 0 0 0;">{{$titulo}}</p>
            <p style="margin: 0; text-align: right; margin-right: 24px; font-size: 14px;">Emissão: {{$dt_atual}}</p>
        </td>
        <td class="text-center align-middle" style="width: 20%; color: red; font-size: 40px; font-weight: bold; border: 1px solid #666666;">
            {{$doc}}<br>
            {{$num}}
        </td>
    </tr>
</table>