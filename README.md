# Мультиплеерные шашки

Этот проект является серверным приложением, поддерживающим игру в шашки. Основными фичами проекта, кроме самой игры, является поддержка нескольких игр одновременно, возможность наблюдать за играми извне и сохранение всех результатов в базе данных. Пример взаимодействия:

Пустой сайт
![Пустой сайт](docs/server/empty_site.png "Пустой сайт")

Создал комнату
![Создал комнату](docs/server/created_room.png "Создал комнату")

Начал игру
![Начал игру](docs/server/started_game.png "Начал игру")

Сделал пару ходов
![Сделал пару ходов](docs/server/made_some_moves.png "Сделал пару ходов")

Подключил наблюдателя и сделал пару ходов
![Подключил наблюдателя и сделал пару ходов](docs/server/viewer_interaction.png "Наблюдатель")

Пример работы с базой данных (можно сверить время создания с временем на скриншотах, в БД все хранится по GMT+0)

Создание комнаты
![Создание комнаты](docs/server/database_room_creation.png "Создание комнаты")
Запись ходов
![Запись ходов](docs/server/database_turns_creation.png "Запись ходов")

## Запуск и установка

Для запуска потребуется докер, этой команды должно хватить

```bash
docker compose up
```
