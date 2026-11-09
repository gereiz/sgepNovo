<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class RefreshCompressedImages extends Command
{
    protected $signature = 'painel:refresh-compressed';
    protected $description = 'Atualiza CompressedJpgImage.jpg baseado na imagem original mais recente';

    public function handle()
    {
        $disk = Storage::disk('public');
        $base = 'outdoorImages';
        $dirs = $disk->directories($base);
        $updated = 0;
        foreach ($dirs as $dir) {
            $files = $disk->files($dir);
            $files = array_filter($files, function ($f) {
                return basename($f) !== 'CompressedJpgImage.jpg';
            });
            if (empty($files)) {
                continue;
            }
            usort($files, function ($a, $b) use ($disk) {
                return $disk->lastModified($b) <=> $disk->lastModified($a);
            });
            $latest = $files[0];
            $compressed = $dir.'/CompressedJpgImage.jpg';
            $src = $disk->path($latest);
            $dst = $disk->path($compressed);
            $info = @getimagesize($src);
            if (!$info || !isset($info['mime'])) {
                continue;
            }
            $mime = strtolower($info['mime']);
            $img = null;
            if (in_array($mime, ['image/jpeg','image/jpg','image/pjpeg']) && function_exists('imagecreatefromjpeg')) {
                $img = @imagecreatefromjpeg($src);
            } elseif ($mime === 'image/png' && function_exists('imagecreatefrompng')) {
                $img = @imagecreatefrompng($src);
            } elseif ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) {
                $img = @imagecreatefromwebp($src);
            }
            if (!$img) {
                continue;
            }
            $ow = imagesx($img);
            $oh = imagesy($img);
            $maxW = 800;
            $scale = $ow > $maxW ? ($maxW / $ow) : 1;
            $nw = max(1, (int)($ow * $scale));
            $nh = max(1, (int)($oh * $scale));
            $dstImg = imagecreatetruecolor($nw, $nh);
            imagecopyresampled($dstImg, $img, 0, 0, 0, 0, $nw, $nh, $ow, $oh);
            @imagejpeg($dstImg, $dst, 65);
            imagedestroy($dstImg);
            imagedestroy($img);
            $updated++;
        }
        $this->info('Imagens comprimidas atualizadas: '.$updated);
        return 0;
    }
}
