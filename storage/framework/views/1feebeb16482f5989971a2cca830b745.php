

<table class="table" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background: #e6e6e6;">
            <th class="text-center font-italic py-0" colspan="8" style="border: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">DESCRIÇÃO DOS SERVIÇOS</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Ident. do Serviço</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Quant.</td>
            <td style="width: 25%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Especificação (Painéis)</td>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Período</td>
            <td style="width: 10%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Pagamento</td>
            <td style="width: 9%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Vlr Bruto</td>
            <td style="width: 12%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Comissões</td>
            <td style="width: 9%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Despesas</td>
        </tr>
        <?php $__currentLoopData = $servicos; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $serv): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e($serv['nome']); ?></td>
            <?php $qtd_cobrada = max(0, ($serv['quantidade'] ?? 0) - ($serv['bonificado'] ?? 0)); ?>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e($qtd_cobrada); ?></td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e(implode(", ", $idPaineis)); ?></td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e($bs_formated); ?></td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                <?php if($forma_pagamento == '1'): ?>
                    AV. Dinheiro
                <?php elseif($forma_pagamento == '2'): ?>
                    AV. PIX
                <?php elseif($forma_pagamento == '3'): ?>
                    Cartão
                <?php elseif($forma_pagamento == '4'): ?>
                    Boleto
                <?php elseif($forma_pagamento == '5'): ?>
                    Depósito
                <?php endif; ?>
            </td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e(formataCash($serv['vlr_unit'] * $serv['quantidade'])); ?></td>
            <?php $__currentLoopData = $agentes; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ag): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <td style="border: 1px solid #cfcfcf; font-size: 10px; padding: 2px 4px;">
                    <?php echo e($ag->nome_fantasia); ?> -<?php if(buscarComissao($comissoes, $serv['id'], $ag->id)[1] == 0): ?> R$ <?php endif; ?>
                        <?php echo e(buscarComissao($comissoes, $serv['id'], $ag->id)[0]); ?>

                        <?php if(buscarComissao($comissoes, $serv['id'], $ag->id)[1] == 1): ?> % <?php endif; ?>
                </td>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e(formataCash(($serv['vlr_custo'] ?? 0) * $qtd_cobrada)); ?></td>
        </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>
<?php /**PATH C:\laragon\www\sgepNovo\resources\views/relatorios/pi/components/descricao_servico_fin.blade.php ENDPATH**/ ?>