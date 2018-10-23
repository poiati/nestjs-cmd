import { Injectable } from "@nestjs/common"
import { CmdAction } from "../src/nest-cmd"

@Injectable()
export class AppService {

    @CmdAction()
    action(): void {
        console.log("Action exec!")
    }

}