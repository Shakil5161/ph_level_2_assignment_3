import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

let server: Server;
const PORT = 5000;

async function main(){
    try {
        await mongoose.connect('mongodb+srv://dbUser:shakil51613236@cluster0.q21nfi0.mongodb.net/library-management-app?retryWrites=true&w=majority&appName=Cluster0');
        server = app.listen(PORT, ()=>{
            console.log(`App is listening on port - ${PORT}`)
        })
    } catch (error) {
        console.log('error', error);
    }
}

main();