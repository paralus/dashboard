import * as R from "ramda";
import { longEm, isSomething } from "../../utils/helpers";

export const promisify = fn => (...args) => {
  return new Promise(resolve => {
    resolve(fn(...args));
  });
};

export const sliceData = R.curry((page, pageSize, data) => {
  const offset = page * pageSize;
  return data.slice(offset, offset + pageSize);
});

export function getSorting(order, orderBy) {
  return order === "desc"
    ? R.descend(R.prop(orderBy))
    : R.ascend(R.prop(orderBy));
}

export const searchData = R.curry((searchText, data) => {
  const textPredicates = searchText.split(",").map(text => {
    return R.test(new RegExp(text.trim(), "ig"));
  });
  const containsText = R.anyPass(textPredicates);
  return data.reduce((a, c) => {
    const values = R.toString(R.values(c));
    const hasText = containsText(values);
    return hasText ? a.concat([c]) : a;
  }, []);
});

export const transformData = R.curry((columns, data) => {
  return data?.map(datum => {
    const updatedDatum = columns.reduce((a, c) => {
      const data = c.dataGetter
        ? c.dataGetter({ dataKey: c.dataKey, rowData: datum })
        : datum[c.dataKey];
      return {
        ...a,
        [c.dataKey]: isSomething(data) ? data : longEm()
      };
    }, {});
    return { ...datum, ...updatedDatum };
  });
});

export const sortCaseInsensitive = R.curry(data =>
  R.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }), data)
);
export const pluckColumnValues = R.curry((columns, data) =>
  columns.reduce((a, c) => {
    if (c.allowFilter)
      a[c.dataKey] = sortCaseInsensitive(R.uniq(R.pluck(c.dataKey)(data)));
    return a;
  }, {})
);

export const getColumnValuesList = (columns, data) =>
  R.pipe(transformData(columns), pluckColumnValues(columns))(data);

export const filterByColumns = R.curry((filters, data) => {
  const colKeys = R.keys(filters);
  if (colKeys.length === 0) return data;
  return data.filter(d => colKeys.every(k => d[k] === filters[k]));
});

export function applyQuery(query, data, columns) {
  let count = 0;
  const list = R.pipe(
    transformData(columns),
    searchData(query.searchText),
    filterByColumns(query.filters),
    R.sort(getSorting(query.order, query.orderBy)),
    R.tap(l => {
      count = l.length;
    }),
    sliceData(query.page, query.pageSize)
  )(data);
  return [list, count];
}

export const applyQueryAsync = promisify(applyQuery);
