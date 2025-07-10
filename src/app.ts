import express from "express";
import { iniciarVerificacaoDeAtrasos } from "./rotina/ValidadorDeAtrasos";
import { conectarBanco } from "./database/mysql";
import { RegisterRoutes } from "./route/routes";
import { setupSwagger } from "./config/swagger";

const PORT = process.env.PORT || 3090;

conectarBanco()
    .then(() => {
        const app = express();

        app.use(express.json());

        const router = express.Router();

        RegisterRoutes(router);

        app.use("/libary", router);

        setupSwagger(app);
        
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            iniciarVerificacaoDeAtrasos();
        });
    })
    .catch((err) => {
        console.error("Falha ao iniciar o servidor devido a erro de banco de dados:", err);
        process.exit(1);
    });