import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class FetchAppStatsService {
    private jwtService: JwtService;

    constructor(){
        this.jwtService = new JwtService({
            secret:"VCtAIhdGBqTE34qxf2xdQ_yBccr6iDC2n2BZfB7Gcq8",
            signOptions:{ algorithm: "HS256"}
        });
    }

    generateExternalToken(): string{
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour

      
        return this.jwtService.sign({exp: expirationTime})
    }

    async callExternalApi(): Promise<any> {
        const token = this.generateExternalToken();
        console.log(token);
        try {
            const response = await axios.post(
                "http://46.18.108.34:5700/client_stats",
                { data: token }, // This sends { "data": "<token>" } in the JSON body
            );

            if (!response.data) {
                throw new Error("Empty data from external API");
            }

            return response.data;
        } catch (err: any) {
            console.error("External API error:", err.response?.data || err.message);
            throw new Error("Failed to fetch app stats data");
        }
    }
}
