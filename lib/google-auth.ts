import { Auth, type AuthConfig } from '@auth/core';
import Google from '@auth/core/providers/google';
import { getToken } from '@auth/core/jwt';
import { headers } from 'next/headers';
import { env } from 'cloudflare:workers';
function setting(name:string) { return (env as unknown as Record<string,string|undefined>)[name] || process.env[name] || ''; }
export function authReady(){return ['AUTH_SECRET','AUTH_GOOGLE_ID','AUTH_GOOGLE_SECRET','AUTH_URL','AUTH_ALLOWED_EMAILS'].every(k=>!!setting(k));}
function origin(){return new URL(setting('AUTH_URL')).origin;}
function allowed(email:string){return setting('AUTH_ALLOWED_EMAILS').split(',').map(v=>v.trim().toLowerCase()).includes(email.toLowerCase());}
function config():AuthConfig{return {
 secret:setting('AUTH_SECRET'),basePath:'/api/auth',trustHost:true,session:{strategy:'jwt'},
 providers:[Google({clientId:setting('AUTH_GOOGLE_ID'),clientSecret:setting('AUTH_GOOGLE_SECRET'),authorization:{params:{scope:'openid email profile',prompt:'select_account'}}})],
 callbacks:{
  async signIn({profile}){return profile?.email_verified===true&&typeof profile.email==='string'&&allowed(profile.email);},
  async jwt({token,account}){if(account?.provider==='google')token.sub='google:'+account.providerAccountId;return token;},
  async redirect({url}){const base=origin();if(url.startsWith('/')&&!url.startsWith('//'))return base+url;try{if(new URL(url).origin===base)return url;}catch{}return base;},
 },theme:{brandColor:'#245c49',logo:'/favicon.svg'},
};}
export async function handleAuth(request:Request){
 if(!authReady())return Response.json({error:'ยังไม่ได้ตั้งค่า Google Login'}, {status:503});
 const url=new URL(request.url),canonical=new URL(origin());
 url.protocol=canonical.protocol;url.host=canonical.host;
 const h=new Headers(request.headers);h.set('host',canonical.host);h.delete('x-forwarded-host');h.delete('x-forwarded-proto');
 return Auth(new Request(url,{method:request.method,headers:h,body:request.method==='GET'?undefined:await request.text()}),config());
}
export async function getGoogleUserFromRequest(request:Request){
 if(!authReady())return null;
 const token=await getToken({req:request,secret:setting('AUTH_SECRET'),secureCookie:origin().startsWith('https:')});
 if(!token?.sub?.startsWith('google:')||typeof token.email!=='string'||!allowed(token.email))return null;
 return {userId:token.sub,displayName:token.name||token.email,email:token.email};
}

export async function getGoogleUser(){const h=await headers();return getGoogleUserFromRequest(new Request(authReady()?origin():'http://localhost',{headers:{cookie:h.get('cookie')||''}}));}
