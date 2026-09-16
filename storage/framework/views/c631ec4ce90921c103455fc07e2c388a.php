<link rel="stylesheet" href="<?php echo e(public_path('assets/vendor/css/rtl/bootstrap.css')); ?>">
<link rel="stylesheet" href="<?php echo e(public_path('assets/css/relatorios.css')); ?>">

<style>
    @page {
        margin: 10px;
    }

    .page-number {
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
    }

    .page-number:after {
        content: "página " counter(page);
    }

    .page-break {
        page-break-before: always;
    }
</style>



<div class="page-number"></div>

<?php
    $statusLabel = ($status_sel ?? 'todos') === 'a_receber' ? 'A RECEBER' : (($status_sel ?? 'todos') === 'recebidos' ? 'RECEBIDOS' : 'TODOS');
    $showAgenteCol = !empty($show_agente_col);
    $colCount = $showAgenteCol ? 9 : 8;
    $agenteNome = trim((string)($agente_nome ?? ''));
    $periodo = trim((string)($periodo ?? ''));
?>

<?php if(empty($grupos) || count($grupos) === 0): ?>
    <?php echo $__env->make('relatorios.includes.rel_header', ['titulo' => 'COMISSÕES '.$statusLabel.($agenteNome ? ' - '.$agenteNome : '').($periodo ? ' - '.$periodo : ''), 'doc' => 'REL', 'num' => ''], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div style="margin-top: 20px; text-align: center;">
        <h4>Nenhuma comissão encontrada para os filtros selecionados.</h4>
    </div>
<?php endif; ?>

<?php $__currentLoopData = ($grupos ?? []); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $percent => $linhas): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php if(!$loop->first): ?>
        <div class="page-break"></div>
    <?php endif; ?>

    <?php echo $__env->make('relatorios.includes.rel_header', ['titulo' => 'COMISSÕES '.$statusLabel.($agenteNome ? ' - '.$agenteNome : '').' - '.$percent.($periodo ? ' - '.$periodo : ''), 'doc' => 'REL', 'num' => ''], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <div style="margin-top: -1.7%;">
        <table class="table table-striped table-bordered">
            <thead>
                <?php if(isset($totais) && $loop->first): ?>
                    <tr>
                        <th colspan="<?php echo e($showAgenteCol ? 5 : 4); ?>" class="text-end small" style="font-weight: 800; font-size: 14px;">
                            Recebidos:
                        </th>
                        <th colspan="1" class="text-start small" style="font-weight: 800; font-size: 14px;">
                            <?php echo e(formataCash($totais['recebidos'] ?? 0)); ?>

                        </th>
                        <th colspan="<?php echo e($showAgenteCol ? 2 : 2); ?>" class="text-end small" style="font-weight: 800; font-size: 14px;">
                            A Receber:
                        </th>
                        <th colspan="1" class="text-start small" style="font-weight: 800; font-size: 14px;">
                            <?php echo e(formataCash($totais['a_receber'] ?? 0)); ?>

                        </th>
                    </tr>
                <?php endif; ?>
                <tr class="thead-dark">
                    <th class="text-center small">PI</th>
                    <th class="text-center small">Parcela</th>
                    <th class="text-center small">Cliente</th>
                    <?php if($showAgenteCol): ?>
                        <th class="text-center small">Agente</th>
                    <?php endif; ?>
                    <th class="text-center small">Vencimento</th>
                    <th class="text-center small">Pagamento</th>
                    <th class="text-center small">Valor da Parcela</th>
                    <th class="text-center small">Valor da Comissão</th>
                    <th class="text-center small">Tipo (Serviço)</th>
                </tr>
            </thead>
            <tbody>
                <?php $totalGrupo = 0; ?>
                <?php $__currentLoopData = $linhas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $l): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php $totalGrupo += (float)($l['valor_comissao'] ?? 0); ?>
                    <tr>
                        <td class="text-center small">PI nº <?php echo e($l['pi'] ?? ''); ?></td>
                        <td class="text-center small"><?php echo e($l['parcela'] ?? ''); ?></td>
                        <td class="text-center small"><?php echo e($l['cliente'] ?? ''); ?></td>
                        <?php if($showAgenteCol): ?>
                            <td class="text-center small"><?php echo e($l['agente'] ?? ''); ?></td>
                        <?php endif; ?>
                        <td class="text-center small"><?php echo e(!empty($l['vencimento']) ? formataDataCompleta($l['vencimento']) : (!empty($l['data_pagamento']) ? formataDataCompleta($l['data_pagamento']) : '—')); ?></td>
                        <td class="text-center small"><?php echo e(!empty($l['data_pagamento_real']) ? formataDataCompleta($l['data_pagamento_real']) : ( (!empty($l['data_pagamento']) && (!empty($l['vencimento']))) ? formataDataCompleta($l['data_pagamento']) : '—')); ?></td>
                        <td class="text-center small"><?php echo e(isset($l['valor_parcela']) ? formataCash($l['valor_parcela']) : '—'); ?></td>
                        <td class="text-center small"><?php echo e(formataCash($l['valor_comissao'] ?? 0)); ?></td>
                        <td class="text-center small"><?php echo e($l['tipo'] ?? ''); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="<?php echo e($showAgenteCol ? 7 : 6); ?>" class="small text-end" style="font-weight: 800; font-size: 14px">
                        Total Comissão (<?php echo e($percent); ?>):
                    </td>
                    <td class="text-center small" style="font-weight: 800; font-size: 14px">
                        <?php echo e(formataCash($totalGrupo)); ?>

                    </td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
        </table>
    </div>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php /**PATH C:\laragon\www\sgepNovo\resources\views/relatorios/comissao/rel_comissoes.blade.php ENDPATH**/ ?>