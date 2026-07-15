import type { Schema, Struct } from '@strapi/strapi';

export interface PageBlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_cta_banners';
  info: {
    displayName: 'CTA Banner';
    icon: 'bell';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['brand', 'dark', 'green', 'amber']
    > &
      Schema.Attribute.DefaultTo<'brand'>;
    button_label: Schema.Attribute.String & Schema.Attribute.Required;
    button_link: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    questions: Schema.Attribute.Component<'shared.faq-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface PageBlocksFeatureList extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_feature_lists';
  info: {
    displayName: 'Feature List';
    icon: 'grid';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    section_title: Schema.Attribute.String;
  };
}

export interface PageBlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_heroes';
  info: {
    description: 'Full-width hero with background image and CTAs';
    displayName: 'Hero Banner';
    icon: 'picture';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['Left', 'Center', 'Right']> &
      Schema.Attribute.DefaultTo<'Center'>;
    background_image: Schema.Attribute.Media<'images' | 'videos'>;
    cta_buttons: Schema.Attribute.Component<'shared.cta-button', true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.Text;
  };
}

export interface PageBlocksProductGrid extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_product_grids';
  info: {
    description: 'Products loaded live from Medusa by collection handle';
    displayName: 'Product Grid';
    icon: 'shoppingCart';
  };
  attributes: {
    heading: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<['Grid', 'Slider']> &
      Schema.Attribute.DefaultTo<'Grid'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 24;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    medusa_collection_handle: Schema.Attribute.String &
      Schema.Attribute.Required;
  };
}

export interface PageBlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_rich_texts';
  info: {
    displayName: 'Rich Text';
    icon: 'file';
  };
  attributes: {
    container_width: Schema.Attribute.Enumeration<['Narrow', 'Full']> &
      Schema.Attribute.DefaultTo<'Narrow'>;
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface PageBlocksTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_testimonials';
  info: {
    displayName: 'Testimonials';
    icon: 'quote';
  };
  attributes: {
    heading: Schema.Attribute.String;
    reviews: Schema.Attribute.Component<'shared.review-item', true>;
  };
}

export interface SharedCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_buttons';
  info: {
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<['primary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_items';
  info: {
    displayName: 'Feature Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReviewItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_review_items';
  info: {
    displayName: 'Review Item';
    icon: 'quote';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    role: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'page-blocks.cta-banner': PageBlocksCtaBanner;
      'page-blocks.faq': PageBlocksFaq;
      'page-blocks.feature-list': PageBlocksFeatureList;
      'page-blocks.hero': PageBlocksHero;
      'page-blocks.product-grid': PageBlocksProductGrid;
      'page-blocks.rich-text': PageBlocksRichText;
      'page-blocks.testimonials': PageBlocksTestimonials;
      'shared.cta-button': SharedCtaButton;
      'shared.faq-item': SharedFaqItem;
      'shared.feature-item': SharedFeatureItem;
      'shared.review-item': SharedReviewItem;
      'shared.seo': SharedSeo;
    }
  }
}
