# ValidadorAutomato
ValidadorAutomato é um projetinho básico feito com HTML, CSS e JavaScript na intenção de criar 
uma ferramenta simples para criar um Autômato Finito Determínistico através da notação JSON e,
a partir daí, conseguir validar o AFD através de palavras passadas a ele.

Pra quem não quiser baixar o projeto basta acessar: http://validadorautomato.azurewebsites.net/ ou https://jsfiddle.net/leandrokoiti/ukgh74tb/

# Como Usar

## Passo 1: Baixar o Visual Studio 2015 Community
Apesar de o código só usar HTML, CSS e JS, ele foi feito utilizando o Microsoft Visual Studio 
2015 Community e a estrutura do ASP.NET MVC, portanto é preciso primeiro baixar o VS 2015 CE
de: https://www.visualstudio.com/pt-br/downloads/download-visual-studio-vs.aspx.

## Passo 2: Baixar o ASP.NET 5
No momento que essa documentação foi escrita a versão disponível era a RC1 que pode ser baixada de: https://blogs.msdn.microsoft.com/webdev/2015/11/18/announcing-asp-net-5-release-candidate-1/.
Logo após instalar o VS2015 no passo anterior instale essa atualização.

## Passo 3: Executar o código
Após baixar o projeto é só abrir a solução no Visual Studio e pressionar CTRL+F5 para executá-lo.

# TODOs
* ~~Eu fiz o código as pressas só para poder testar os AFDs que eu estava criando, por isso é preciso
refatorar os JavaScripts para faciliar a manutenção.~~

* ~~Além disso, não existe necessidade de ser um projeto ASP.NET MVC então o ideal seria remover ele
e deixar somente os arquivos HTML, CSS e JS que são de fatos necessários para permitir qualquer
um executar em qualquer lugar.~~ 

* Criei um projeto em ASP.NET 5 onde quem quiser só mexer no HTML basta baixar a pasta wwwroot.

* Como eu só usei esse validador para encontrar palavras aceitas indevidamente, eu não testei muito
a fundo, o ideal seria criar testes para validar a lógica de criação do AFD e quem sabe até gerar
possíveis casos de teste de forma automática a partir do AFD gerado!

* ~~Criar um validador para AFND.~~

* É preciso efetuar testes na lógica do AFND pois ele ainda não foi validado.

* ~~Escrever um validador para AFND a pilha.~~

* É preciso efetuar testes na lógica do AP também pois ele também não foi validado.

* Criar uma animação para demonstrar passo a passo o autômato funcionando.

# TL;DR
Basta baixar a pasta ~/ValidadorAutomato/wwwroot e copiar para seu servidor web favorito (se for o IIS precisa remover 
o web.config) que o site já vai funcionar sem precisar usar Visual Studio ;)
