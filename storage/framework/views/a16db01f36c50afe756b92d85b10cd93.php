<table class="table" style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid #cfcfcf;">
    <tbody>
        <tr>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">TOTAL:</td>
            
            <td colspan="11" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                <?php
                    $total = 0;
                ?>
                <?php $__currentLoopData = $servicos; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $serv): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php
                        $total += $serv['vlr_total'];
                    ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                <strong style="font-size: 12px;"><?php echo e(formataCash($total)); ?></strong>
            </td>
            
        </tr>
        <tr>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Corretor:</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;"><?php echo e($vendedor); ?></td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Faturar sobre:</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                <?php if($faturamento['faturar_sobre'] == '1'): ?>
                    Vlr Bruto
                <?php elseif($faturamento['faturar_sobre'] == '2'): ?>
                    Vlr Liquido
                <?php endif; ?>
            </td>
            <td colspan="2" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Faturar contra:</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                <?php if($faturamento['faturar_contra'] == '1'): ?>
                    Cliente
                <?php elseif($faturamento['faturar_contra'] == '2'): ?>
                    Agência
                <?php endif; ?>
            </td>
            <td colspan="2" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Enviar Faturamento:</td>
            <td colspan="3" style="border: 1px solid #cfcfcf !important; font-size: 11px; padding: 2px 4px;">
                <?php if($faturamento['enviar_faturamento'] == '1'): ?>
                    Cliente
                <?php elseif($faturamento['enviar_faturamento'] == '2'): ?>
                    Agência
                <?php endif; ?>
            </td>
        </tr>
        <tr>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">
                Outros Agentes:
            </td>
            <td colspan="8" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                <?php $__currentLoopData = collect($agentes)->slice(1); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $agente): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php echo e($agente->nome_fantasia ? $agente->nome_fantasia : $agente->razao_social); ?>

                    <?php if(!$loop->last): ?> || <?php endif; ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">
                Campanha:
            </td>
            <td colspan="2" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                <strong><?php echo e($campanha ?? ''); ?></strong>
            </td>
        </tr>    
    </tbody>
</table>

<?php if(count($lista_lancamentos) > 1): ?>
    <table class="table" style="border-collapse: collapse; width: 100%; margin-top: -10px; border: 1px solid #cfcfcf;">
        <tbody>
            <tr style="background: #e6e6e6;">
                <td colspan="12" class="text-center font-italic py-0" style="border: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px; font-weight: bold;">PARCELAS:</td>
            </tr>
            <?php
                $totalParcelas = count($lista_lancamentos);
                $colunas = min(4, ceil($totalParcelas / 3));
                $parcelasPorColuna = min(3, ceil($totalParcelas / $colunas));
                $totalFinanceiro = 0;
                $totalCliente = 0;
                foreach ($servicos as $serv) {
                    $qtd_cobrada = max(0, ($serv['quantidade'] ?? 0) - ($serv['bonificado'] ?? 0));
                    $totalFinanceiro += (($serv['vlr_unit'] - $serv['vlr_desc'] - $serv['vlr_custo']) * $qtd_cobrada);
                    $totalCliente += (($serv['vlr_unit'] - $serv['vlr_desc']) * $qtd_cobrada);
                }
            ?>

            <?php for($i = 0; $i < $parcelasPorColuna; $i++): ?>
                <tr>
                    <?php for($j = 0; $j < $colunas; $j++): ?>
                        <?php
                            $index = $j * $parcelasPorColuna + $i;
                        ?>
                        <?php if($index < $totalParcelas): ?>
                            <td colspan="3" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                                <?php
                                    $valorManualCli = $lista_lancamentos[$index]['valor'] ?? null;
                                    if ($valorManualCli !== null && $totalCliente > 0) {
                                        $ratio = $valorManualCli / $totalCliente;
                                        $valorParcelaFin = $ratio * $totalFinanceiro;
                                    } else {
                                        $valorParcelaFin = ($totalParcelas > 0) ? ($totalFinanceiro / $totalParcelas) : 0;
                                    }
                                ?>
                                Parcela <?php echo e($lista_lancamentos[$index]['parcelas']); ?> => <?php echo e(formataCash($valorParcelaFin)); ?> - Venc: <?php echo e(formataData($lista_lancamentos[$index]['data_lancamento'])); ?>

                            </td>
                        <?php else: ?>
                            <td colspan="3" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">&nbsp;</td>
                        <?php endif; ?>
                    <?php endfor; ?>
                </tr>
            <?php endfor; ?>
        </tbody>
    </table>
<?php endif; ?>
<?php /**PATH C:\laragon\www\sgepNovo\resources\views/relatorios/pi/components/totais_fin.blade.php ENDPATH**/ ?>