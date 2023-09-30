# Nginx proxy-reverser with Node.js


| Tecnologias | Nome |
| -- | -- |
| <img height="50" src="https://user-images.githubusercontent.com/25181517/183345125-9a7cd2e6-6ad6-436f-8490-44c903bef84c.png" /> | Nginx |
| <img height="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" /> | Express.js |
| <img height="50" src="https://user-images.githubusercontent.com/25181517/183896128-ec99105a-ec1a-4d85-b08b-1aa1620b2046.png" /> | MySQL |

Esse repositório tem como objetivo por em prática os conceitos obtidos no módulo de Docker do curso FullCycle.

## Objetivos:
- Retornar a lista de usuários cadastradas em um banco de dados MySQL:
  - Request:
    ```
    curl --location 'http://localhost:8080/'
    ```
  - Response
    ``` html
    <h1>Full Cycle Rocks!</h1>
    <li>Lista de nomes cadastrada no banco de dados.../</li>
    ```

- Cadastrar usuários no banco de dados:
  - Request:
    ```
    curl --location --request POST 'http://localhost:8080/people/<nome_usuário>'
    ```
  - Response
    ```
        Ok
    ```

- [EXTRA] Restaurar os usuários na versão inicial:
  - Request:
    ```
    curl --location --request POST 'http://localhost:8080/reset'
    ```
  - Response
    ```
        Ok
    ```

## Instruções de execução:

``` bash
    docker-compose up --build
```