const electron = require("electron");
const {
    v4: uuidv4
} = require('uuid');
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let todayWindow;
let createWindow;
let listWindow;

let allAppointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Aplikasi Kasir Sederhana"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit()
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Semua Transaksi"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null))
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Catat Transaksi"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (listWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuidv4();
    allAppointment.push(appointment);

    createWindow.close();
    console.log(allAppointment);
});
ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointment);
});
ipcMain.on("appointment:request:today", event => {
    console.log("Selamat Datang");
});

const menuTemplate = [{
        label: "File",
        submenu: [{
                label: "Catat Transaksi",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "Semua Transaksi",
                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Keluar",
                accelerato: process.platform === "darwin" ? "Command+Q" : "Ctrl + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {
        label: "View",
        submenu: [{
            role: "reload"
        }, {
            role: "toggledevtools"
        }]
    }
]