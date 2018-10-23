const { NestFactory } = require("@nestjs/core")
const { AppModule } = require("./app.module")
const { AppService } = require("./app.service")
const { NestCmd } = require("../src/nest-cmd")

class Output {
    constructor() {
        this.data = ""
    }

    write(data) {
        this.data += data
    }
}

let cmd
let output

beforeEach(async () => {
    const app = await NestFactory.create(AppModule)
    output = new Output()
    cmd = new NestCmd(app, output)
})

test("no command: print usage", () => {
    cmd.execute()

    expect(output.data).toEqual([
        "Usage: <command> [args]",
        "",
        "No command available",
        ""
    ].join("\n"))
})

test("command help: print usage", () => {
    cmd.execute("help")

    expect(output.data).toEqual([
        "Usage: <command> [args]",
        "",
        "No command available",
        ""
    ].join("\n"))
})

describe("with registered command", () => {
    beforeEach(() => {
        cmd.register(AppService)
    })

    test("no command: print usage", () => {
        cmd.execute()

        expect(output.data).toEqual([
            "Usage: <command> [args]",
            "",
            "Commands:",
            "\tAppService#action",
            ""
        ].join("\n"))
    })

    test("command help: print usage", () => {
        cmd.execute("help")

        expect(output.data).toEqual([
            "Usage: <command> [args]",
            "",
            "Commands:",
            "\tAppService#action",
            ""
        ].join("\n"))
    })

    test("command <name>: execute the command", () => {
        cmd.execute("AppService#action")
        expect(output.data).toEqual([
            ""
        ].join("\n"))
    })
})
