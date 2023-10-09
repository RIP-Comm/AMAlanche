.PHONY: dc-up
dc-up:
	@docker-compose up -d

.PHONY: dc-down
dc-down:
	@docker-compose down

.PHONY: run-be
run-be:
	@cd backend && go mod tidy && go run ./main.go

.PHONY: lint-be
lint-be:
	@go install mvdan.cc/gofumpt@latest
	@gofumpt -l -w .
