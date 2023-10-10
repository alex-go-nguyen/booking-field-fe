import { Helmet } from 'react-helmet-async';

export type SeoProps = {
  title: string;
  description: string;
};
export const Seo = ({ title, description }: SeoProps) => {
  return (
    <div className='application'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{title}</title>
        <meta name='og:title' content={title} />
        <meta name='twitter:title' content={title} />

        <meta name='description' content={description} />
        <meta name='og:description' content={description} />
        <meta name='twitter:description' content={description} />
      </Helmet>
    </div>
  );
};
