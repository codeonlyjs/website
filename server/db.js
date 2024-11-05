import { config } from "./config.js";
import { Database, SQL } from '@toptensoftware/sqlite';
export * from "@toptensoftware/sqlite";


class AppDatabase extends Database
{
    constructor()
    {
        // Open DB
        super(config.server.dbFile ?? "db.sqlite");

        // Migrate
        this.migrate([
            () => {
                // Version 1

                this.createTable({
                    tableName: "Sessions",
                    columns: [
                        { id: "STRING NOT NULL PRIMARY KEY" },
                        { created: "DATE NOT NULL" },
                        { user_id: "BIGINT NOT NULL" },
                    ]
                });

                this.createTable({
                    tableName: "OTP",
                    columns: [
                        { user_id: "INTEGER NOT NULL" },
                        { created: "DATE NOT NULL" },
                        { otp: "STRING NOT NULL" },
                    ]
                });

                this.createTable({
                    tableName: "Users",
                    columns: [
                        { id: "INTEGER PRIMARY KEY AUTOINCREMENT" },
                        { name: "STRING" },
                        { admin: "INTEGER NOT NULL DEFAULT 0" },
                        { email: "STRING NOT NULL" },
                        { access: "INTEGER NOT NULL DEFAULT 0" },
                    ],
                    indicies: [
                        {
                            unique: true,
                            columns: [ "email" ],
                        }
                    ]
                });

                this.insert("Users", {
                    email: "brad@toptensoftware.com",
                    name: "Brad",
                    admin: 1,
                    access: 1,
                });

                this.insert("Users", {
                    email: "mitchell@vercidium.com",
                    name: "Mitch",
                    admin: 0,
                    access: 1,
                });

                this.insert("Users", {
                    email: "jenny@toptensoftware.com",
                    name: "Jen",
                    admin: 0,
                    access: 1,
                });


                this.createTable({
                    tableName: "Log",
                    columns: [
                        { id: "INTEGER PRIMARY KEY AUTOINCREMENT" },
                        { user_id: "INTEGER NOT NULL" },
                        { time: "DATE NOT NULL" },
                        { kind: "STRING NOT NULL" },
                        { data: "STRING NOT NULL" },
                    ],
                });
            },
        ]);
    }
}


export let db = new AppDatabase();

