.PHONY: dc-up
dc-up:
	@docker-compose -p amalanche -f ./docker-compose.yml up -d

.PHONY: dc-down
dc-down:
	@docker-compose down

.PHONY: run-be
run-be:
	@cd backend && go mod tidy && go run ./main.go

.PHONY: run-fe
run-fe:
	@cd frontend && npm i && npm start

.PHONY: lint-be
lint-be:
	@go install mvdan.cc/gofumpt@latest
	@gofumpt -l -w .

.PHONY: lint-fe
lint-fe:
	@cd frontend && npx prettier --write .

.PHONY: lint
lint: lint-be lint-fe

.PHONY: swagger
generate-swagger:
	@cd backend && swag init --parseDependency --parseInternal
