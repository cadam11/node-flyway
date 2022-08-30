import {expect} from "chai";
import {describe, it} from 'mocha';
import {FlywayConfig} from '../../src/types/types';
import {FlywayCommandLineOptions} from "../../src/internal/flyway-command-line-options";

describe("CommandLineOptionGenerator", () => {


    it("can generate command line options", async () => {

        const config: FlywayConfig = {
            url: "test-url",
            user: "test-user",
            migrationLocations: ["dir_1", "dir_2"]
        }

        const result = FlywayCommandLineOptions.build(config);

        expect(result.getCommandLineOptions()).to.contains.members(
            [
                '-url=test-url',
                '-user=test-user',
                '-locations="dir_1,dir_2"'
            ]
        );

        expect(result.getCommandLineOptions()).to.have.length(3);
    });


    it("can generate advanced command line options", async () => {

        const config: FlywayConfig = {
            url: "test-url",
            user: "test-user",
            migrationLocations: ["dir_1", "dir_2"],
            advanced: {
                createSchemas: true,
                applyNewMigrationsOutOfOrder: true,
                sqlMigrationPrefix: "V__",
                initSql: "CREATE TABLE random.some_table (id INTEGER PRIMARY KEY, some_column TEXT NOT NULL);",
                groupPendingMigrations: true,

            }
        }

        const result = FlywayCommandLineOptions.build(config);

        expect(result.getCommandLineOptions()).to.contains.members(
            [
                '-url=test-url',
                '-user=test-user',
                '-locations="dir_1,dir_2"',
                '-createSchemas=true',
                '-outOfOrder=true',
                '-sqlMigrationPrefix=V__',
                '-initSql="CREATE TABLE random.some_table (id INTEGER PRIMARY KEY, some_column TEXT NOT NULL);"',
                '-group=true'
            ]
        );

        expect(result.getCommandLineOptions()).to.have.length(8);
    });


    it("can generate command line options including specified schemas", async () => {

        const config: FlywayConfig = {
            url: "test-url",
            user: "test-user",
            defaultSchema: "public",
            migrationLocations: ["dir_1", "dir_2"],
            advanced: {
                createSchemas: true,
                schemas: ["example"]
            }
        };

        const result = FlywayCommandLineOptions.build(config);

        expect(result.getCommandLineOptions()).to.contains.members(
            [
                '-url=test-url',
                '-user=test-user',
                '-locations="dir_1,dir_2"',
                '-createSchemas=true',
                '-defaultSchema=public',
                '-schemas="example"'
            ]
        );

        expect(result.getCommandLineOptions()).to.have.length(6);
    });


})