import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FetchAppStatsService {
    private jwtService: JwtService;

    constructor(private prisma : PrismaService){
        this.jwtService = new JwtService({
            secret:process.env.EXTERNALAPI_SECRET_KEY,
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
        const apiurl= process.env.EXTERNAL_API
          if (!apiurl) {
                throw new Error('Missing EXTERNAL_API environment variable');
            }

        try {
            const response = await axios.post(
                apiurl,
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

    async fetchAndStore(): Promise<void>{
       try{
        const data = await this.callExternalApi();
        if(!data){
            throw new Error("No data Object received");
        }

        const detail = data.detail
        if(!detail){
            throw new Error("No detail property in data")
        }

        const dateString = detail.date
        if(!dateString){
            throw new Error("Missing date in detail")
        }

        const date = new Date(dateString);
        const createdAt= new Date();

        const features = detail.features
        if(!features || typeof features !== "object"){
            throw new Error("Missing or invalid features in detail")
        }

        for(const [featureKey, featureApps] of Object.entries(features)){
             if (!featureApps || typeof featureApps !== 'object') {
                console.warn(`Skipping invalid featureApps for feature: ${featureKey}`);
                continue;
            }
             // Find AppApi by ai_name (e.g., faceswap)
            const appApi = await this.prisma.appApi.findFirst({
                // where:{
                //     ai_name: featureKey,
                // }
                where:{
                    ai_name:{
                        equals: featureKey,
                        mode:"insensitive",
                    }
                }
            });

            if(!appApi){
                console.warn(`AppApi not found for feature: ${featureKey}`);
                continue;
            }

            for(const [appName, count] of Object.entries<number>(featureApps as Record<string, number>)){
                //Find App by app_name
                const app = await this.prisma.app.findFirst({
                    where:{
                        app_name: {
                                equals: appName,
                                mode: 'insensitive',
                            }
                    },
                });

                if(!app){
                    console.warn(` App not found for app_name: ${appName}`);
                    continue;
                }

                const userApp = await this.prisma.userApp.findFirst({
                    where:{
                        ua_app_id: app.app_id,
                    }
                })

                if(!userApp){
                    console.warn(`UserApp not found for app_id: ${app.app_id}`);
                    continue
                }

                await this.prisma.appStats.create({
                    data:{
                        as_date: date,
                        as_ai_id: appApi.ai_id,
                        as_ua_id: userApp.ua_id,
                        as_count: count,
                        as_created_at: createdAt,
                        as_updated_at: createdAt,
                        as_status: 1
                    }
                });

                // console.log(`Stored AppStats: feature= ${featureKey}, app=${appName}, count = ${count}`)
            }
        }
       } catch (err){
        console.error("Error in fetch and Store:", err)
        throw new Error("Failed to fetch and store app stats")
       }
    }
}
