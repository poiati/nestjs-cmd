import { INestApplication } from "@nestjs/common";

export class NestCmd {
    private commands: { [key: string]: Function } = {}

    static fromApplication(app: INestApplication): NestCmd {
        return new this(app, process.stdout)
    }

    constructor(private app: INestApplication, private output: any) {}

    execute(command = ""): void {
        const commandsKeys = Object.keys(this.commands)

        switch(command) {
            case "":
            case "help":
                this.output.write("Usage: <command> [args]\n")
                if (commandsKeys.length === 0) {
                    this.output.write("\nNo command available\n")
                    return
                }
                this.output.write("\nCommands:")
                commandsKeys.forEach((command) => {
                    this.output.write(`\n\t${command}`)
                })
                this.output.write("\n")
                break
            default:
                this.commands[command]()

        }
    }

    register(type: any): void {
        const provider = this.app.get(type)
        const providerProto = Object.getPrototypeOf(provider)
        const methodsNames = Object.getOwnPropertyNames(providerProto)

        methodsNames.forEach((methodName) => {
            if (methodName !== "constructor" && Reflect.hasMetadata("cmd:action", provider, methodName)) {
                this.commands[`${type.name}#${methodName}`] = provider[methodName]
            }
        })
    }
}

export const CmdAction = (): MethodDecorator => {
    return (target, propertyKey) => {
        Reflect.defineMetadata("cmd:action", true, target, propertyKey)
    }
}