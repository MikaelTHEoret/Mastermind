document.getElementById('sendbtn').addEventListener('click', function() {
    var input = document.getElementById('chatinput').value;
    if (input) {
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: input })
        })
        .then(response => response.json())
        .then(data => {
            var chatlog = document.getElementById('chatlog');
            chatlog.innerHTML += '<div>' + data + '</div>';
            document.getElementById('chatinput').value = '';
        });
    }
});
