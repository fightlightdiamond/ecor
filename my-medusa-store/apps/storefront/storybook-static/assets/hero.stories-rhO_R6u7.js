import{j as a}from"./iframe-ClCR02oG.js";import{c as u,H as he,B as le}from"./index-CfYrbFvZ.js";import"./preload-helper-C1FmrZbK.js";const me={eyebrow:"Thăng Long Chè Việt",title:"Không gian thư giãn giữa lòng Hà Nội",subtitle:"Trải nghiệm salon & spa với liệu pháp chăm sóc tóc, da và cơ thể — phong cách Việt, tiêu chuẩn quốc tế.",imageSrc:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",imageAlt:"Không gian salon Thăng Long Chè Việt",primaryCta:{label:"Đặt lịch ngay",href:"/store"},secondaryCta:{label:"Khám phá dịch vụ",href:"/store"},align:"left",overlay:"medium",size:"default"},l={salon:{label:"Salon / tóc",src:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",alt:"Không gian salon hiện đại"},spa:{label:"Spa / thư giãn",src:"https://images.unsplash.com/photo-1540555700478-4be289fbec23?auto=format&fit=crop&w=1920&q=80",alt:"Không gian spa thư giãn"},tea:{label:"Trà / ẩm thực",src:"https://images.unsplash.com/photo-1556678727-4f8f6a55e9c1?auto=format&fit=crop&w=1920&q=80",alt:"Không gian thưởng trà"},interior:{label:"Nội thất tối giản",src:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",alt:"Nội thất tối giản sang trọng"}},oe={thangLongVi:{label:"Thăng Long Chè Việt (Tiếng Việt)",content:me},thangLongEn:{label:"Thăng Long (English)",content:{eyebrow:"Thang Long Tea Vietnam",title:"A calm retreat in the heart of Hanoi",subtitle:"Salon & spa experiences for hair, skin, and body — Vietnamese soul, international standards.",imageSrc:l.spa.src,imageAlt:"Thang Long spa interior",primaryCta:{label:"Book now",href:"/store"},secondaryCta:{label:"Explore services",href:"/store"},align:"left",overlay:"medium",size:"default"}},medusaStarter:{label:"Medusa starter (demo)",content:{eyebrow:"Medusa Storefront",title:"Ecommerce Starter Template",subtitle:"Powered by Medusa and Next.js — customize this hero in Storybook.",imageSrc:void 0,imageAlt:"",primaryCta:{label:"View on GitHub",href:"https://github.com/medusajs/medusa",external:!0},secondaryCta:{label:"Browse store",href:"/store"},align:"center",overlay:"medium",size:"default"}},minimal:{label:"Chỉ chữ (không ảnh)",content:{eyebrow:"Thăng Long Chè Việt",title:"Đặt lịch trực tuyến",subtitle:"Chọn dịch vụ và thời gian phù hợp — xác nhận trong vài phút.",imageSrc:void 0,imageAlt:"",primaryCta:{label:"Bắt đầu",href:"/store"},secondaryCta:void 0,align:"center",overlay:"medium",size:"compact"}}},pe={compact:"min-h-[55vh] sm:min-h-[60vh]",default:"min-h-[70vh] sm:min-h-[75vh]",tall:"min-h-[85vh] sm:min-h-[90vh]"},ye={light:"bg-gradient-to-t from-ui-bg-base/70 via-ui-bg-base/40 to-ui-bg-base/10",medium:"bg-gradient-to-t from-ui-bg-base/95 via-ui-bg-base/70 to-ui-bg-base/30",dark:"bg-gradient-to-t from-black/90 via-black/55 to-black/25"};function ce({cta:e,variant:t}){const r=u("w-full sm:w-auto min-h-[44px]",t==="primary"&&"shadow-elevation-card-rest");return e.external?a.jsx("a",{href:e.href,target:"_blank",rel:"noreferrer",className:"inline-flex w-full sm:w-auto",children:a.jsx(le,{variant:t==="primary"?"primary":"secondary",className:r,children:e.label})}):a.jsx("a",{href:e.href,className:"inline-flex w-full sm:w-auto",children:a.jsx(le,{variant:t==="primary"?"primary":"secondary",className:r,children:e.label})})}function be(e){return e==="center"?{section:"items-center text-center",cta:"items-center sm:justify-center",vertical:"justify-center"}:{section:"items-start text-left",cta:"items-stretch sm:items-center sm:justify-start",vertical:"justify-end sm:justify-center"}}const se=({eyebrow:e,title:t,subtitle:r,imageSrc:s,imageAlt:i="",primaryCta:n,secondaryCta:o,align:m="left",overlay:g="medium",size:h="default"})=>{const p=!!s,c=be(m),d=pe[h];return a.jsxs("section",{className:u("relative w-full border-b border-ui-border-base overflow-hidden",d),"aria-label":"Hero",children:[p?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"absolute inset-0 bg-ui-bg-subtle bg-cover bg-center bg-no-repeat",style:{backgroundImage:`url(${s})`},role:"img","aria-label":i}),a.jsx("div",{className:u("absolute inset-0",ye[g]),"aria-hidden":!0})]}):a.jsx("div",{className:"absolute inset-0 bg-ui-bg-subtle","aria-hidden":!0}),a.jsx("div",{className:u("content-container relative z-10 flex flex-col py-10 sm:py-16 lg:py-24",d,c.vertical),children:a.jsxs("div",{className:u("flex w-full max-w-3xl flex-col gap-4 sm:gap-6",c.section,m==="center"&&"mx-auto"),children:[e?a.jsx("p",{className:"text-small-semi uppercase tracking-[0.2em] text-ui-fg-subtle",children:e}):null,a.jsx(he,{level:"h1",className:"text-2xl sm:text-3xl lg:text-4xl leading-tight text-ui-fg-base font-normal",children:t}),a.jsx("p",{className:"text-base-regular sm:text-large-regular text-ui-fg-subtle max-w-2xl",children:r}),a.jsxs("div",{className:u("flex w-full flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4",c.cta),children:[a.jsx(ce,{cta:n,variant:"primary"}),o?a.jsx(ce,{cta:o,variant:"secondary"}):null]})]})})]})};se.__docgenInfo={description:"",methods:[],displayName:"LandingHero",props:{eyebrow:{required:!1,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""},imageSrc:{required:!1,tsType:{name:"string"},description:""},imageAlt:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'""',computed:!1}},primaryCta:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  label: string
  /** Path or full URL. Internal paths omit country code — page adds it. */
  href: string
  external?: boolean
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!0},description:"Path or full URL. Internal paths omit country code — page adds it."},{key:"external",value:{name:"boolean",required:!1}}]}},description:""},secondaryCta:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  label: string
  /** Path or full URL. Internal paths omit country code — page adds it. */
  href: string
  external?: boolean
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!0},description:"Path or full URL. Internal paths omit country code — page adds it."},{key:"external",value:{name:"boolean",required:!1}}]}},description:""},align:{required:!1,tsType:{name:"union",raw:'"left" | "center"',elements:[{name:"literal",value:'"left"'},{name:"literal",value:'"center"'}]},description:"Text and CTA alignment. Default: left",defaultValue:{value:'"left"',computed:!1}},overlay:{required:!1,tsType:{name:"union",raw:'"light" | "medium" | "dark"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"medium"'},{name:"literal",value:'"dark"'}]},description:"Background overlay when `imageSrc` is set. Default: medium",defaultValue:{value:'"medium"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"compact" | "default" | "tall"',elements:[{name:"literal",value:'"compact"'},{name:"literal",value:'"default"'},{name:"literal",value:'"tall"'}]},description:"Vertical height of the hero block. Default: default",defaultValue:{value:'"default"',computed:!1}}}};function ve(e){var t,r,s;const i=Object.entries(l).find(([,ge])=>ge.src===e.imageSrc);var n,o,m,g,h,p,c,d,E;return{contentPreset:"custom",eyebrow:(n=e.eyebrow)!==null&&n!==void 0?n:"",showEyebrow:!!e.eyebrow,title:e.title,subtitle:e.subtitle,showBackgroundImage:!!e.imageSrc,imagePreset:(o=i==null?void 0:i[0])!==null&&o!==void 0?o:"custom",imageSrc:(m=e.imageSrc)!==null&&m!==void 0?m:"",imageAlt:(g=e.imageAlt)!==null&&g!==void 0?g:"",overlay:(h=e.overlay)!==null&&h!==void 0?h:"medium",showSecondaryCta:!!e.secondaryCta,primaryCtaLabel:e.primaryCta.label,primaryCtaHref:e.primaryCta.href,primaryCtaExternal:!!e.primaryCta.external,secondaryCtaLabel:(p=(t=e.secondaryCta)===null||t===void 0?void 0:t.label)!==null&&p!==void 0?p:"",secondaryCtaHref:(c=(r=e.secondaryCta)===null||r===void 0?void 0:r.href)!==null&&c!==void 0?c:"",secondaryCtaExternal:!!(!((s=e.secondaryCta)===null||s===void 0)&&s.external),align:(d=e.align)!==null&&d!==void 0?d:"left",size:(E=e.size)!==null&&E!==void 0?E:"default"}}function fe(e){const t={...ie,...e};var r;const s=(r=t.contentPreset)!==null&&r!==void 0?r:"custom";if(s!=="custom"&&s in oe){const n=oe[s].content,o=t.imagePreset in l?t.imagePreset:"custom";return{...n,align:t.align,overlay:t.overlay,size:t.size,eyebrow:t.showEyebrow?n.eyebrow:void 0,secondaryCta:t.showSecondaryCta?n.secondaryCta:void 0,imageSrc:t.showBackgroundImage?o!=="custom"?l[o].src:t.imageSrc||n.imageSrc:void 0,imageAlt:o!=="custom"?l[o].alt:t.imageAlt||n.imageAlt}}const i=t.imagePreset in l?t.imagePreset:"custom";return{eyebrow:t.showEyebrow?t.eyebrow:void 0,title:t.title,subtitle:t.subtitle,imageSrc:t.showBackgroundImage?i!=="custom"?l[i].src:t.imageSrc:void 0,imageAlt:i!=="custom"?l[i].alt:t.imageAlt,primaryCta:{label:t.primaryCtaLabel,href:t.primaryCtaHref,external:t.primaryCtaExternal||void 0},secondaryCta:t.showSecondaryCta?{label:t.secondaryCtaLabel,href:t.secondaryCtaHref,external:t.secondaryCtaExternal||void 0}:void 0,align:t.align,overlay:t.overlay,size:t.size}}const ie=ve(me),de=Object.entries(oe).map(([e,t])=>({value:e,title:t.label})),ue=Object.entries(l).map(([e,t])=>({value:e,title:t.label})),we={custom:"Tùy chỉnh",...Object.fromEntries(de.map(e=>[e.value,e.title]))},_e={custom:"URL tùy chỉnh",...Object.fromEntries(ue.map(e=>[e.value,e.title]))};var P,k,L,N,H,B,A,I,V,O,j,R,q,M,D,z,G,U,K,F,X,Y,W,Z,$,J,Q,ee,te,ae,re,ne;const Se={title:"Landing/Hero",component:se,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
### Cách tùy chỉnh (không cần sửa code)

1. Mở story **Playground**
2. Tab **Controls** → chỉnh theo nhóm:

| Nhóm | Tùy chọn |
|------|----------|
| ⚡ Preset nhanh | Bộ copy VI / EN / Medusa / Chỉ chữ |
| 📝 Nội dung | Eyebrow, tiêu đề, mô tả |
| 🖼 Hình nền | Bật ảnh, preset salon/spa/trà, độ tối lớp phủ |
| 🔘 Nút bấm | Nhãn, link, ẩn nút phụ |
| 📐 Bố cục | Căn trái/giữa, chiều cao |

3. Copy giá trị ưng ý vào \`hero-content.ts\` để đưa lên production.
        `.trim()}},controls:{expanded:!0,sort:"requiredFirst"}},args:ie,render:e=>a.jsx(se,{...fe(e)}),argTypes:{contentPreset:{name:"Bộ nội dung",description:"Chọn preset có sẵn hoặc Tùy chỉnh để tự nhập từng trường.",control:"select",options:["custom",...de.map(e=>e.value)],labels:we,table:{category:"⚡ Preset nhanh"}},showEyebrow:{name:"Hiện dòng phụ (eyebrow)",control:"boolean",table:{category:"📝 Nội dung"}},eyebrow:{name:"Eyebrow",control:"text",if:{arg:"showEyebrow",truthy:!0},table:{category:"📝 Nội dung"}},title:{name:"Tiêu đề chính",control:"text",if:{arg:"contentPreset",eq:"custom"},table:{category:"📝 Nội dung"}},subtitle:{name:"Mô tả",control:{type:"text",rows:4},if:{arg:"contentPreset",eq:"custom"},table:{category:"📝 Nội dung"}},showBackgroundImage:{name:"Hiện ảnh nền",control:"boolean",table:{category:"🖼 Hình nền"}},imagePreset:{name:"Ảnh có sẵn",control:"select",options:["custom",...ue.map(e=>e.value)],labels:_e,if:{arg:"showBackgroundImage",truthy:!0},table:{category:"🖼 Hình nền"}},imageSrc:{name:"URL ảnh (tùy chỉnh)",control:"text",if:{arg:"imagePreset",eq:"custom"},table:{category:"🖼 Hình nền"}},imageAlt:{name:"Alt text ảnh",control:"text",if:{arg:"imagePreset",eq:"custom"},table:{category:"🖼 Hình nền"}},overlay:{name:"Độ tối lớp phủ",control:"radio",options:["light","medium","dark"],labels:{light:"Nhẹ",medium:"Vừa",dark:"Đậm"},if:{arg:"showBackgroundImage",truthy:!0},table:{category:"🖼 Hình nền"}},primaryCtaLabel:{name:"Nhãn nút chính",control:"text",if:{arg:"contentPreset",eq:"custom"},table:{category:"🔘 Nút bấm"}},primaryCtaHref:{name:"Link nút chính",control:"text",if:{arg:"contentPreset",eq:"custom"},table:{category:"🔘 Nút bấm"}},primaryCtaExternal:{name:"Mở tab mới (nút chính)",control:"boolean",if:{arg:"contentPreset",eq:"custom"},table:{category:"🔘 Nút bấm"}},showSecondaryCta:{name:"Hiện nút phụ",control:"boolean",table:{category:"🔘 Nút bấm"}},secondaryCtaLabel:{name:"Nhãn nút phụ",control:"text",if:{arg:"showSecondaryCta",truthy:!0},table:{category:"🔘 Nút bấm"}},secondaryCtaHref:{name:"Link nút phụ",control:"text",if:{arg:"showSecondaryCta",truthy:!0},table:{category:"🔘 Nút bấm"}},secondaryCtaExternal:{name:"Mở tab mới (nút phụ)",control:"boolean",if:{arg:"showSecondaryCta",truthy:!0},table:{category:"🔘 Nút bấm"}},align:{name:"Căn nội dung",control:"inline-radio",options:["left","center"],labels:{left:"Trái",center:"Giữa"},table:{category:"📐 Bố cục"}},size:{name:"Chiều cao hero",control:"radio",options:["compact","default","tall"],labels:{compact:"Thấp",default:"Chuẩn",tall:"Cao"},table:{category:"📐 Bố cục"}}}},y={parameters:{docs:{description:{story:"Story chính để thử nghiệm. Đổi **Bộ nội dung** sang preset có sẵn, hoặc chọn `custom` rồi nhập từng trường. Dùng toolbar Viewport để xem mobile."}}}},b={name:"Preset · Thăng Long (VI)",args:{contentPreset:"thangLongVi",showEyebrow:!0,showBackgroundImage:!0,imagePreset:"salon",showSecondaryCta:!0,align:"left",overlay:"medium",size:"default"}},v={name:"Preset · Thăng Long (EN)",args:{contentPreset:"thangLongEn",showEyebrow:!0,showBackgroundImage:!0,imagePreset:"spa",showSecondaryCta:!0}},f={name:"Preset · Chỉ chữ",args:{contentPreset:"minimal",showEyebrow:!0,showBackgroundImage:!1,showSecondaryCta:!1,align:"center",size:"compact"}},w={name:"Preset · Medusa demo",args:{contentPreset:"medusaStarter",showEyebrow:!0,showBackgroundImage:!1,showSecondaryCta:!0,align:"center"}},_={name:"Ảnh spa · lớp phủ đậm",args:{contentPreset:"custom",showEyebrow:!0,eyebrow:"Spa & Wellness",title:"Thư giãn trọn vẹn cuối tuần",subtitle:"Gói chăm sóc body 90 phút — ưu đãi tháng này.",showBackgroundImage:!0,imagePreset:"spa",overlay:"dark",showSecondaryCta:!0,primaryCtaLabel:"Đặt lịch",primaryCtaHref:"/store",secondaryCtaLabel:"Xem bảng giá",secondaryCtaHref:"/store",align:"left",size:"tall"}},C={name:"Ảnh trà · căn giữa",args:{contentPreset:"custom",showEyebrow:!0,eyebrow:"Trà Việt",title:"Hương trà xưa, không gian mới",subtitle:"Thưởng thức trà artisan trong không gian tĩnh lặng giữa phố.",showBackgroundImage:!0,imagePreset:"tea",overlay:"medium",showSecondaryCta:!1,primaryCtaLabel:"Khám phá",primaryCtaHref:"/store",align:"center",size:"default"}},x={name:"Responsive · Mobile",args:ie,parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Xem hero trên iPhone SE (375px). Nút bấm full-width, chữ xếp dọc."}}}},T={name:"Responsive · Tablet",parameters:{viewport:{defaultViewport:"tablet"}}},S={name:"Responsive · Desktop",parameters:{viewport:{defaultViewport:"desktop"}}};y.parameters={...y.parameters,docs:{...(P=y.parameters)===null||P===void 0?void 0:P.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Story chính để thử nghiệm. Đổi **Bộ nội dung** sang preset có sẵn, hoặc chọn \`custom\` rồi nhập từng trường. Dùng toolbar Viewport để xem mobile."
      }
    }
  }
}`,...(L=y.parameters)===null||L===void 0||(k=L.docs)===null||k===void 0?void 0:k.source},description:{story:"🎛 Bắt đầu tại đây — mọi control đều hoạt động trên story này.",...(H=y.parameters)===null||H===void 0||(N=H.docs)===null||N===void 0?void 0:N.description}}};b.parameters={...b.parameters,docs:{...(B=b.parameters)===null||B===void 0?void 0:B.docs,source:{originalSource:`{
  name: "Preset · Thăng Long (VI)",
  args: {
    contentPreset: "thangLongVi",
    showEyebrow: true,
    showBackgroundImage: true,
    imagePreset: "salon",
    showSecondaryCta: true,
    align: "left",
    overlay: "medium",
    size: "default"
  }
}`,...(I=b.parameters)===null||I===void 0||(A=I.docs)===null||A===void 0?void 0:A.source}}};v.parameters={...v.parameters,docs:{...(V=v.parameters)===null||V===void 0?void 0:V.docs,source:{originalSource:`{
  name: "Preset · Thăng Long (EN)",
  args: {
    contentPreset: "thangLongEn",
    showEyebrow: true,
    showBackgroundImage: true,
    imagePreset: "spa",
    showSecondaryCta: true
  }
}`,...(j=v.parameters)===null||j===void 0||(O=j.docs)===null||O===void 0?void 0:O.source}}};f.parameters={...f.parameters,docs:{...(R=f.parameters)===null||R===void 0?void 0:R.docs,source:{originalSource:`{
  name: "Preset · Chỉ chữ",
  args: {
    contentPreset: "minimal",
    showEyebrow: true,
    showBackgroundImage: false,
    showSecondaryCta: false,
    align: "center",
    size: "compact"
  }
}`,...(M=f.parameters)===null||M===void 0||(q=M.docs)===null||q===void 0?void 0:q.source}}};w.parameters={...w.parameters,docs:{...(D=w.parameters)===null||D===void 0?void 0:D.docs,source:{originalSource:`{
  name: "Preset · Medusa demo",
  args: {
    contentPreset: "medusaStarter",
    showEyebrow: true,
    showBackgroundImage: false,
    showSecondaryCta: true,
    align: "center"
  }
}`,...(G=w.parameters)===null||G===void 0||(z=G.docs)===null||z===void 0?void 0:z.source}}};_.parameters={..._.parameters,docs:{...(U=_.parameters)===null||U===void 0?void 0:U.docs,source:{originalSource:`{
  name: "Ảnh spa · lớp phủ đậm",
  args: {
    contentPreset: "custom",
    showEyebrow: true,
    eyebrow: "Spa & Wellness",
    title: "Thư giãn trọn vẹn cuối tuần",
    subtitle: "Gói chăm sóc body 90 phút — ưu đãi tháng này.",
    showBackgroundImage: true,
    imagePreset: "spa",
    overlay: "dark",
    showSecondaryCta: true,
    primaryCtaLabel: "Đặt lịch",
    primaryCtaHref: "/store",
    secondaryCtaLabel: "Xem bảng giá",
    secondaryCtaHref: "/store",
    align: "left",
    size: "tall"
  }
}`,...(F=_.parameters)===null||F===void 0||(K=F.docs)===null||K===void 0?void 0:K.source}}};C.parameters={...C.parameters,docs:{...(X=C.parameters)===null||X===void 0?void 0:X.docs,source:{originalSource:`{
  name: "Ảnh trà · căn giữa",
  args: {
    contentPreset: "custom",
    showEyebrow: true,
    eyebrow: "Trà Việt",
    title: "Hương trà xưa, không gian mới",
    subtitle: "Thưởng thức trà artisan trong không gian tĩnh lặng giữa phố.",
    showBackgroundImage: true,
    imagePreset: "tea",
    overlay: "medium",
    showSecondaryCta: false,
    primaryCtaLabel: "Khám phá",
    primaryCtaHref: "/store",
    align: "center",
    size: "default"
  }
}`,...(W=C.parameters)===null||W===void 0||(Y=W.docs)===null||Y===void 0?void 0:Y.source}}};x.parameters={...x.parameters,docs:{...(Z=x.parameters)===null||Z===void 0?void 0:Z.docs,source:{originalSource:`{
  name: "Responsive · Mobile",
  args: DEFAULT_HERO_STORY_ARGS,
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    },
    docs: {
      description: {
        story: "Xem hero trên iPhone SE (375px). Nút bấm full-width, chữ xếp dọc."
      }
    }
  }
}`,...(J=x.parameters)===null||J===void 0||($=J.docs)===null||$===void 0?void 0:$.source}}};T.parameters={...T.parameters,docs:{...(Q=T.parameters)===null||Q===void 0?void 0:Q.docs,source:{originalSource:`{
  name: "Responsive · Tablet",
  parameters: {
    viewport: {
      defaultViewport: "tablet"
    }
  }
}`,...(te=T.parameters)===null||te===void 0||(ee=te.docs)===null||ee===void 0?void 0:ee.source}}};S.parameters={...S.parameters,docs:{...(ae=S.parameters)===null||ae===void 0?void 0:ae.docs,source:{originalSource:`{
  name: "Responsive · Desktop",
  parameters: {
    viewport: {
      defaultViewport: "desktop"
    }
  }
}`,...(ne=S.parameters)===null||ne===void 0||(re=ne.docs)===null||re===void 0?void 0:re.source}}};const Ee=["Playground","ThangLongVietnamese","ThangLongEnglish","MinimalTextOnly","MedusaDemo","DarkOverlaySpa","CenterAlignedTea","Mobile","Tablet","Desktop"];export{C as CenterAlignedTea,_ as DarkOverlaySpa,S as Desktop,w as MedusaDemo,f as MinimalTextOnly,x as Mobile,y as Playground,T as Tablet,v as ThangLongEnglish,b as ThangLongVietnamese,Ee as __namedExportsOrder,Se as default};
