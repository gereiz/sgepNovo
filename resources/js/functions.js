import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useToastr } from '@/Components/toastr';
import html2pdf from 'html2pdf.js'


export const toastr = useToastr();
export const formReserva = reactive({cliente: '', campanha: '', observ: ''})



export function detectMob() {
    return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
  }


export function getImage(amb, i) {

    if(amb == 'local') {
        // Desenvolvimento
        var image = 'http://localhost:8000/storage/'+ i 

    } else {
        // Produção
        var image = '/storage/'+ i 
    }
    
    return image
} 


export function enviaWpp(urlRel) {
    let telwpp =  '5533984316850';
    let msgwpp = '3032 Deluxe'
    let url_wpp = ''

    console.log(navigator.userAgentData.mobile)

     if(navigator.userAgentData.mobile) {
        url_wpp = "https://api.whatsapp.com/send?phone="+telwpp+"&text="+msgwpp+"%0a"+ urlRel;
     } else {
        url_wpp = "https://web.whatsapp.com/send?phone="+telwpp+"&text="+msgwpp+"%0a"+ urlRel;
     }

     

    if(telwpp == '' || msgwpp == '') 
    {
        alert('Informe o telefone e a mensagem')
        return 
    }

    

    window.open(url_wpp);

}
