import { GetStaticProps } from "next"

interface IProduct {
  id: string;
  title: string;
}

interface ITop10Props {
  top10Products: IProduct[];
}

export default function Top10({ top10Products }: ITop10Props) {
  return (
    <div>
      <h1>Top 10</h1>
      <ul>
        {top10Products.map(top10Product => {
          return (
            <li key={top10Product.id}>
              {top10Product.title}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ITop10Props> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
  const products = await response.json();

  return {
    props: {
      top10Products: products
    },
    revalidate: 5,
  }
}