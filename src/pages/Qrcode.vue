<template>
    <div>
        <div class="layout">
            <!--
            <div class="close-item" @click="(e) => console.log(e)" v-if="qrCode">
                X
            </div>
            -->
            <div class="container">
                <div class="container-session">
                    <div id="left-div">
                        <img :src="LoginImage" alt="Login Team" />
                    </div>
                    <div id="right-div">
                        <div v-if="qrCode && !connected"
                            style="display: flex; flex-direction: column;justify-content: center; align-items: center;">
                            <span>
                                <img :src="qrCode" style="max-width:350px" class="animation noselect" autoplay
                                    alt="Smartphone" draggable="false" />
                            </span>
                            <h1>Escaneie o QrCode com o app do WhatsApp</h1>

                        </div>
                        <div v-if="connected">
                            <h1 id="title">WhatsApp conectado!</h1>
                        </div>
                        <form v-if="!qrCode && !connected" @submit="submitSession">
                            <h1 id="title">Verifique sua conexão do WhatsApp</h1>
                            <p class="description" id="description"> Digite seu email utilizado no Sailor, e o código
                                fornecido pelo colaborador da Speedio</p>
                            <div class="top-info">
                                <small>Email</small>
                            </div>
                            <input id="session" autoComplete="off" placeholder="nome@email.com" v-model="email" />
                            <div class="top-info">
                                <small>
                                    Código
                                </small>
                            </div>
                            <input id="token" autoComplete="off" placeholder="******-****-****-****" v-model="code" />
                            <button type="submit" id="send-btn">
                                Verificar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api, { socket } from '../services/api.js'
import wppApi from '../services/api.js'
import { login } from '../services/auth'
import router from '../router/index'
import axios from 'axios'


//Assets
import LoginImage from "../assets/speedio-logo.jpeg";
import LoadingImage from "../assets/loading.gif";
import { useStore } from '../stores/dataStore'
import configjs from "../config";
// config.LANGUAGE
export default {
    async mounted() {
        const showQrCode = async (qrCode) => {
            await this.showQrCode(qrCode)
        }
        socket.on("qrCode", (qrCode) => {
            showQrCode(qrCode)
        });
        const handleSessionlogged = async (status) => {
            await this.handleSessionlogged(status)
        }
        socket.off("session-logged").on("session-logged", (status) => {
            handleSessionlogged(status)
        });
    },
    setup() {
        const data = useStore()

        return { data }
    },
    data() {
        return {
            // response: any,
            connected: false,
            allowerReload: false,
            email: '',
            code: '',
            session: '',
            token: '',
            qrCode: '',
            haveLogin: '',

            LoginImage: LoginImage,
            LoadingImage: LoadingImage,
        }
    },
    methods: {
        showQrCode(qrCode) {
            if (this.session === qrCode.session) {
                this.qrCode = qrCode.data;
            }
        },
        async startSession() {
            try {
                this.qrCode = LoadingImage;
                while (!this.connected) {
                    const response = await axios.get(configjs.WPP_API + `/user/email-whatsapp-session?email=${this.email}&code=${this.code}`)
                    console.log(response)
                    if (response.data.qrcode != null) {
                        this.qrCode = response.data.qrcode
                    }
                    else if (response.data.status == 'connected') {
                        this.connected = true
                    }
                    else if (response.data.status == 'ERROR') {
                        this.qrCode = ''
                        this.$swal(
                            'Erro',
                            response.data.message,
                            'erro');
                        return
                    }
                    await this.sleep(5000)
                }

                const config = {
                    headers: { Authorization: `Bearer ${this.token}` }
                };

                // const checkConn = await api.get(`${this.session}/check-connection-session`, config);
                // if (!checkConn.data.status) {
                //     await this.signSession();
                // } else {
                //     this.insertLocalStorage();
                //     setTimeout(() => {
                //         location.reload();
                //     },1000)
                // }
            } catch (e) {
                console.log(e)
                var that = this;
                setTimeout(function () {
                    that.qrCode = '';
                    that.$swal(
                        'Oops... Something went wrong',
                        'Check that the session and token are correct.',
                        'error');
                }, 2000);
            }
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms))
        },
        async signSession() {
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };
            await api.post(`${this.session}/start-session`, null, config)
        },
        async submitSession(e) {
            e.preventDefault();
            if (!this.email || !this.code) {
                this.$swal(
                    'Preencha os campos',
                    'Voce precisa completar os campos pra gerar um código.',
                    'erro');
            } else {
                await this.startSession();
            }
        },
        handleSessionlogged(status) {
            if (status.session === this.session) {
                if (this.token) {
                    this.insertLocalStorage();
                    location.reload();
                }
            }
        },
        insertLocalStorage() {
            login(JSON.stringify({ session: this.session, token: this.token }));
        },
    }

}
</script>
<style scoped>
div .layout {
    height: 100%;
    width: 100%;

    display: flex;
    overflow: hidden;

    justify-content: center;
    align-items: center;
    position: relative;
}

.layout .close-item {
    position: absolute;
    top: 2em;
    right: 2em;

    cursor: pointer;
}

div .container {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
}

.container-session {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.container-session #left-div {
    width: 60%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F8F8F8;
}

.container-session #left-div img {
    width: 500px;
    height: 500px;
    object-fit: contain;
}

.container-session #right-div {
    width: 40%;
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 2em;
}

h1 .title {
    font-size: 3rem;
    font-weight: 500;
    color: #444;
}

p .description {
    color: #555;
    font-size: 16px;
    font-weight: 300;
    margin-top: 1em;
}

img .imageCustom {
    width: 300px;
    object-fit: cover;
    margin: 0 auto;
}

form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1em;
}

form small {
    font-size: 12px;
}

form .top-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2em;
    margin-bottom: 10px;
}

form .top-info span {
    color: #4666F7;
    border-bottom: 1px solid #4666F7;
    cursor: pointer;
}

form input {
    background: #fff;
    border: 1px solid #d5d7da;
    border-radius: 4px;
    outline: 0;
    padding: 10px;
}

form button {
    background: #4666F7;
    padding: 10px 25px;
    border: 0;
    color: #fff;
    outline: 0;
    cursor: pointer;
    transition-duration: 200ms;
    margin-top: 1em;
    border-radius: 5px;
}

form button:hover {
    background: #263fb1;
    box-shadow: 0 2.8px 2.2px rgba(70, 102, 247, 0.034),
        0 6.7px 5.3px rgba(70, 102, 247, 0.048),
        0 12.5px 10px rgba(70, 102, 247, 0.06),
        0 22.3px 17.9px rgba(70, 102, 247, 0.072),
        0 41.8px 33.4px rgba(70, 102, 247, 0.086),
        0 100px 80px rgba(70, 102, 247, 0.12);
}

form button:disabled {
    background: #5b5e78;
    cursor: not-allowed;
}
</style>