import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { AppService } from "./app.service"
import { NestCmd } from "../src/nest-cmd"

async function booststrap() {
    const app = await NestFactory.create(AppModule)
    const cmd = NestCmd.fromApplication(app)

    cmd.register(AppService)
    cmd.execute(process.argv[2])
} 

booststrap()