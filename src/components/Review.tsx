import styles from 'styles/review.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import { Reviews } from 'types/review';
import { useState } from 'react';
import ReviewSelect from './ReviewSort ';
import Pagination from './Paging';
import { NextApiRequest, NextApiResponse } from 'next';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({
  itemId,
  total,
}: {
  itemId: number;
  total: number;
}) {
  const [num, setNum] = useState(1);
  const [sort, setSort] = useState('reviewId&_order=desc');

  const { data } = useSWR(`/api/selectReview/${itemId}`, fetcher);

  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );

  const reviews = data.data;

  // 点数の配列のみ取り出す
  let scoreArr = reviews.map((dataList: Reviews) => {
    return dataList.evaluation;
  });

  let sum = 0;
  //平均点を求める
  if (!scoreArr.length) {
    sum = 0;
  } else {
    sum = scoreArr.reduce((pre: number, curr: number) => pre + curr);
  }

  // 平均点に１０をかけ、小数点を切り捨てた後１０で割ると小数点一桁のみ表示可能
  let average = Math.floor((sum / scoreArr.length) * 10) / 10;

  // 平均点を四捨五入
  let rate = Math.round(average * 2) / 2;

  if (!average) {
    average = 0;
    rate = 0;
  }

  const handleClick = (number: number) => {
    setNum(number);
  };

  const selectChange = (value: string) => {
    setSort(value);
  };

  return (
    <>
      <section className={styles.accordionWrapper}>
        <h1 className={styles.title}>レビュー</h1>
        <p className={styles.score}>総合{average}点</p>
        <p className={styles.star}>
          <span className={styles.rating} data-rate={rate}></span>
        </p>
        <div className={styles.accordionOuter}>
          <ReviewSelect selectChange={selectChange} />
          {reviews.map((review: Reviews) => {
            return (
              <div key={review.id} className={styles.accordion}>
                <input
                  type="checkbox"
                  className={styles.toggle}
                  id={String(review.id)}
                />
                <label
                  className={styles.label}
                  htmlFor={String(review.id)}
                >
                  {review.reviewName}

                  {review.spoiler && (
                    <span className={styles.tag}>ネタバレあり </span>
                  )}
                </label>
                <div className={styles.contentBody}>
                  <p>投稿者名：{review.userName}</p>
                  <p>投稿日：{review.postTime}</p>
                  <p>点数：{review.evaluation}点</p>
                  <p>{review.reviewText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* <Pagination
        totalCount={total}
        pageSize={5}
        onClick={handleClick}
        currentPage={0}
      /> */}
      <style jsx>
        {`
          p {
            margin-block-start: 0;
            margin-block-end: 0;
          }
        `}
      </style>
    </>
  );
}
