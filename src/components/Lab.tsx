import React, { useEffect, useState } from "react";
import { labHelper } from "./helpers/labHelper";
import Tippy from "@tippyjs/react";
import styles from "./styled/Lab.module.scss";

export const Lab = () => {
  const [answer, setAnswer] = useState<{
    simpson: { t: number; answer: number; n: number }[];
    knotThread: { t: number; answer: number }[];
    knotFourier: { t: number; answer: number }[];
  }>(
    {} as {
      simpson: { t: number; answer: number; n: number }[];
      knotThread: { t: number; answer: number }[];
      knotFourier: { t: number; answer: number }[];
    }
  );
  useEffect(() => {
    const helper = new labHelper();
    setAnswer(helper.roundM());
  }, []);
  return (
    <div className={styles.root}>
      <table className={styles.list}>
        <tr>
          <td />
          <td>t</td>
          <td>Simpson</td>
          <td>3 knot</td>
          <td>4 knot</td>
        </tr>
        {answer.simpson && answer.simpson.length !== 0
          ? answer.simpson.map((item, index) => {
              return (
                <tr className={styles["list__item"]}>
                  <td>{index + 1}</td>
                  <td>{item.t}</td>
                  <Tippy
                    content={`N: ${item.n}`}
                    className={styles.tip}
                  >
                    <td>{item.answer}</td>
                  </Tippy>
                  <td>{answer.knotThread[index].answer}</td>
                  <td>{answer.knotFourier[index].answer}</td>
                </tr>
              );
            })
          : null}
      </table>
    </div>
  );
};
