/*
 * Copyright 2022 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import axios from "axios";
import { io } from "socket.io-client";
import config from "../config.js";

const ip = config.IP_SERVER;
const wpp = config.WPP_API;

export const socket = io(config.IP_SOCKET_IO);
export const api = axios.create({ baseURL: ip });
export const wppApi = axios.create({ baseURL: wpp });
export default api;
