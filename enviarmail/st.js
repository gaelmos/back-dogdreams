const btn=document.getElementById("button");
document.getElementById("form")
    .addEventListener("submit", function(event){
        event.preventDefault();
        ImageBitmap.value="enviando";
        const servistid="defult_servise";
        const templateid="template_rjlmxc";
        emailjs.sendForm(servistid, templateid, this)
            .then(()=>{
                btn.value="send mail";
                alert("enviado!");
            })
            .catch((err) =>{
                btn.value = "send mail";
                alert(JSON.stringify(err));
            })
    })