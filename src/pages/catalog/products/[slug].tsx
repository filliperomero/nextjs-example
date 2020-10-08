import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Prismic from 'prismic-javascript';
import Link from 'next/link'
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { client } from '@/lib/prismic';
import { GetStaticPaths, GetStaticProps } from 'next';

interface IProductProps {
  product: Document;
}

const AddToCartModal = dynamic(
  () => import('@/components/AddToCartModal'),
  { loading: () => <p>Loading...</p>, ssr: false }
)

export default function Product({ product }: IProductProps) {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} width="300" alt="image" />

      <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }} />

      <p>Price: ${product.data.price}</p>
      
      <br />
      <br />
      <br />
      <button type="button" onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // With paths = [] and fallback = true, next will check if there is a static
  // page, if there isn't a page, next will create a static page for it.
  
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 5,
  }
}
