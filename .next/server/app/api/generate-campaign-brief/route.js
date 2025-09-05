"use strict";(()=>{var e={};e.id=6507,e.ids=[6507],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},90801:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>f,requestAsyncStorage:()=>c,routeModule:()=>g,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l});var a={};r.r(a),r.d(a,{POST:()=>u});var n=r(49303),i=r(88716),s=r(60670),o=r(87070),p=r(64837);async function u(e){try{let{campaignName:t,objective:r,targetAudience:a,incentives:n}=await e.json();if(!t||!r||!a||!n)return o.NextResponse.json({error:"All fields are required"},{status:400});let i=`Generate a detailed campaign brief for a UGC campaign. 
Campaign Name: ${t}
Objective: ${r}
Target Audience: ${a}
Incentives: ${n}

Include sections for: 
- Campaign Overview
- Goals
- Target Audience
- Key Message/Call to Action
- Incentives for Participation
- Promotion Channels
- Tracking & Measurement
- Timeline (suggested)
- Hashtag (suggested, e.g., #ZenithWorkflow)

Make it professional and engaging.`,s=await (0,p.B)(i);return o.NextResponse.json({brief:s},{status:200})}catch(e){return console.error("Error generating campaign brief:",e),o.NextResponse.json({error:"Failed to generate campaign brief"},{status:500})}}let g=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/generate-campaign-brief/route",pathname:"/api/generate-campaign-brief",filename:"route",bundlePath:"app/api/generate-campaign-brief/route"},resolvedPagePath:"/Users/test/startups/zenith/src/app/api/generate-campaign-brief/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:d}=g,m="/api/generate-campaign-brief/route";function f(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}},64837:(e,t,r)=>{r.d(t,{B:()=>s});var a=r(11258);let n=process.env.GEMINI_PAID_KEYS||"";if(!n)throw Error("GEMINI_PAID_KEYS environment variable is not set.");let i=new a.$D(n);async function s(e){let t=i.getGenerativeModel({model:"gemini-pro"}),r=await t.generateContent(e);return(await r.response).text()}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[8948,5972,1258],()=>r(90801));module.exports=a})();