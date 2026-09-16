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
        content: "página " counter(page) " de 2";
    }

    .page-break {
        page-break-before: always;
    }
</style>


    
    <?php
        $num = str_pad($pi->id, 4, '0', STR_PAD_LEFT);
    ?>

<div class="page-number"></div>

<?php echo $__env->make('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Financeiro'], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<?php echo $__env->make('relatorios.pi.components.autorizacao_servico', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<?php echo $__env->make('relatorios.pi.components.descricao_servico_fin', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<?php echo $__env->make('relatorios.pi.components.totais_fin', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<?php echo $__env->make('relatorios.pi.components.assinaturas', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<!-- Quebra de página para a quarta página -->
<div style="page-break-after: always;"></div>

<!-- Cabeçalho da segunda página -->
<?php echo $__env->make('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Financeiro'], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<!-- Conteúdo da segunda página -->
<?php echo $__env->make('relatorios.pi.components.informacoes_contratuais', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php /**PATH C:\laragon\www\sgepNovo\resources\views/relatorios/pi/pi_fin_nova.blade.php ENDPATH**/ ?>