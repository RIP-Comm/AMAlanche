# AMAlanche

## TODO

- Main Features (high priority)

    - [X] Initialize Frontend (React).
    - [X] Pick a CSS library (TailwindCSS) and framework (ChakraUI).
    - [x] Initialize Backend (Golang, Gin).
    - [x] Initialize Backend Connection with DB with ORM.
    - [ ] Authentication Username/Password
    - [x] Authentication Google,
    - [x] Implement Channel (Main view with the ability to create new Q/A, Polls, ... ).
    - [x] Q/A.
    - [ ] Polls.
    - [x] Channel sharing (URL).
    - [ ] Different sort methods (by upvotes, by time, ...).
    - [ ] Implement Organization (1 owner, multiple moderators, multiple "normal" members).
    - [ ] Channel visibility (public or private (requires to be invited or be a member of the organization)).

- Extra Features (low priority):

    - [x] Answer to question and recursive answer to answer (Reddit style).
    - [ ] Direct message to profile (Ask style).
    - [ ] Different poll types.
    - [ ] Twitch integration. Bot for new questions and votes?

- (Super) Extra Features (very low priority):
    - [ ] Multi-tenant.
    - [ ] Organization's calendars, events, ...

# Development Backend side

- Install Go :)
- Install docker + docker-compose
- Make sure your system can run make commands

### Run Containers

```bash
make dc-up
```

### Run BE

```bash
make run-be
```

### Run FE

```bash
make run-fe
```

### Lint code

```bash
make lint
```

#### Lint BE

```bash
make lint-be
```

#### Lint FE

```bash
make lint-fe
```