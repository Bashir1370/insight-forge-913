import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VisualPageEditor } from "@/features/data-resources/VisualPageEditor";
import { VisualContentEditor } from "@/features/data-resources/VisualContentEditor";
import { VisualAssetEditor } from "@/features/data-resources/VisualAssetEditor";

const image = "/images/gdc/gdc-home-clean.webp";
const hotspots = [{id:"5",title:"Search",x:82,y:16,width:15,height:6}];
const content = [{key:"title",label:"عنوان صفحه",value:"GDC Resource Tour"}];

export const Route = createFileRoute("/admin/resource-tours")({
  ssr:false,
  beforeLoad: async()=>{
    const {data:{user}} = await supabase.auth.getUser();
    if(!user) throw redirect({to:"/auth"});
  },
  component: ResourceToursAdmin,
});

function ResourceToursAdmin(){
 const [img,setImg]=useState(image);
 const [hs,setHs]=useState(hotspots);
 const [blocks,setBlocks]=useState(content);
 return <main className="min-h-screen bg-slate-50 p-8" dir="rtl">
 <h1 className="text-2xl font-black">Visual CMS - GDC</h1>
 <div className="mt-6 space-y-6">
 <VisualAssetEditor imageUrl={img} onSave={setImg}/>
 <VisualPageEditor title="GDC Resource Tour" imageUrl={img} hotspots={hs} onSave={setHs}/>
 <VisualContentEditor items={blocks} onSave={setBlocks}/>
 </div></main>
}
