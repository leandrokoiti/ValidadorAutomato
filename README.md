# ValidadorAutomato
ValidadorAutomato é um projetinho básico feito com HTML, CSS e JavaScript na intenção de criar 
uma ferramenta simples para criar um Autômato Finito Determínistico através da notação JSON e,
a partir daí, conseguir validar o AFD através de palavras passadas a ele.

Pra quem não quiser baixar o projeto basta acessar: http://validadorautomato.azurewebsites.net/

# Como Usar

## Passo 1: Baixar o Visual Studio 2015 Community
Apesar de o código só usar HTML, CSS e JS, ele foi feito utilizando o Microsoft Visual Studio 
2015 Community e a estrutura do ASP.NET MVC, portanto é preciso primeiro baixar o VS 2015 CE
de: https://www.visualstudio.com/pt-br/downloads/download-visual-studio-vs.aspx.

## Passo 2: Executar o código
Após baixar o projeto é só abrir a solução no Visual Studio e pressionar CTRL+F5 para executá-lo.

# TODOs
Eu fiz o código as pressas só para poder testar os AFDs que eu estava criando, por isso é preciso
refatorar os JavaScripts para faciliar a manutenção.

Além disso, não existe necessidade de ser um projeto ASP.NET MVC então o ideal seria remover ele
e deixar somente os arquivos HTML, CSS e JS que são de fatos necessários para permitir qualquer
um executar em qualquer lugar.

Como eu só usei esse validador para encontrar palavras aceitar indevidamente, eu não testei muito
a fundo, o ideal seria criar testes para validar a lógica de criação do AFD e quem sabe até gerar
possíveis casos de teste de forma automática a partir do AFD gerado!
