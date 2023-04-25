import { JwtResponseKeys } from "../models/Jwt";
import { LoginRequest, LoginResponse } from "../models/Login";
import * as jwt from 'jsonwebtoken';
const pool = require('../db/conn');


export const validarLogin = async (login: LoginRequest) => {
    let retorno: number = 0;
    const sql = `select * from dados_login where login = ? and senha = ?`;
    const values = [login.usuario, login.senha];
    const promisePool = pool.promise();
    let valor: Array<any> = await promisePool.query(sql, values, (err: Error, data: any) => {
        if (err) {
            retorno = 500;
        }
    });
    if (valor[0].length > 0) {
        retorno = 200;
    } else {
        retorno = 401;
    }
    return retorno;
}



export const buscarLogin = async (login: LoginRequest) => {
    let retorno: LoginResponse = { id: 0, perfil: "" };
    const sql = `select usuario.id, dados_login.perfil from usuario inner join dados_login on usuario.dados_login_id = dados_login.id where login = ? and senha = ?`;
    const values = [login.usuario, login.senha];
    const promisePool = pool.promise();
    let valor: Array<any> = await promisePool.query(sql, values, (err: Error, data: any) => {
        if (err) {
            console.log(err);
        }
    });
    if (valor[0].length > 0) {
        retorno = valor[0];
    }

    return retorno;
}

export const buscarLoginPorId = async (id: number) => {
    let retorno: LoginResponse = { id: 0, perfil: "" };
    const sql = `select * from usuario where id = ?`;
    const values = [id];
    const promisePool = pool.promise();
    let valor: Array<any> = await promisePool.query(sql, values, (err: Error, data: any) => {
        if (err) {
            console.log(err);
        }
    });
    if (valor[0].length > 0) {
        retorno = valor[0];
    }

    return retorno;
}

export const gerarToken = async (loginReponse: any) => {
    const dados_login: JwtResponseKeys = {
        userId: loginReponse[0].id,
        userType: loginReponse[0].perfil
    }
    return jwt.sign(dados_login, 'random_key', { expiresIn: '1h' });
}

export const validarToken = (token: string) =>  {
    let retorno: number = 0;
    if (!token) {
        retorno = 401;
    }
    try {
        jwt.verify(token, 'random_key', (err, decoded) => {
            if (err) {
                retorno = 403;
            } else {
                retorno = 200;
            }
        });

    }
    catch (e) {
        retorno = 500;
    }
    return retorno;
}

export const retornaLogin = async (token: string): Promise<string> => {
    try {
        const decoded: any = await jwt.verify(token, 'random_key');
        const login: any = await buscarLoginPorId(decoded.userId);                    
        return login[0].nome;
    } catch (err) {
        console.error(err);
        return "";
    }
}


