import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, SlidersHorizontal, PanelTopClose, PanelTopOpen, Github } from 'lucide-react';
import './App.css';

// --- ユーティリティ関数 ---
const generateRandomArray = (size) => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
};

// --- アルゴリズムデータ ---
const ALGORITHMS = {
  bubbleSort: {
    name: "バブルソート",
    pseudocode: [
      "for i from 0 to n-1:",
      "  for j from 0 to n-i-2:",
      "    if arr[j] > arr[j+1]:",
      "      swap(arr[j], arr[j+1])",
    ],
    explanation: {
        description: "隣り合う要素を比較し、大小関係が逆であれば交換する操作を繰り返します。比較的単純で理解しやすいアルゴリズムです。",
        timeComplexity: "O(n²)",
        bestCase: "O(n)",
        spaceComplexity: "O(1)",
    },
    sort: (arr) => {
      const history = [];
      const n = arr.length;
      let a = [...arr];
      history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: -1 });
      for (let i = 0; i < n; i++) {
        history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: i}, (_, k) => n - 1 - k), pointers: { i }, line: 0 });
        for (let j = 0; j < n - i - 1; j++) {
          history.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: Array.from({length: i}, (_, k) => n - 1 - k), pointers: { i, j }, line: 1 });
          history.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: Array.from({length: i}, (_, k) => n - 1 - k), pointers: { i, j }, line: 2 });
          if (a[j] > a[j + 1]) {
            history.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k), pointers: { i, j }, line: 3 });
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            history.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k), pointers: { i, j }, line: 3 });
          }
        }
      }
      history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, k) => k), pointers: {}, line: -1 });
      return history;
    },
  },
  selectionSort: {
    name: "選択ソート",
    pseudocode: [
        "for i from 0 to n-2:",
        "  min_idx = i",
        "  for j from i+1 to n-1:",
        "    if arr[j] < arr[min_idx]:",
        "      min_idx = j",
        "  swap(arr[i], arr[min_idx])",
    ],
    explanation: {
        description: "未ソート部分から最小値を探し、未ソート部分の先頭要素と交換します。交換回数が少ないのが特徴です。",
        timeComplexity: "O(n²)",
        bestCase: "O(n²)",
        spaceComplexity: "O(1)",
    },
    sort: (arr) => {
        const history = [];
        const n = arr.length;
        let a = [...arr];
        history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: -1 });
        for (let i = 0; i < n - 1; i++) {
            let min_idx = i;
            history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i }, line: 0, variables: { i }});
            history.push({ array: [...a], comparing: [min_idx], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, min_idx }, line: 1, variables: { i, min_idx }});
            for (let j = i + 1; j < n; j++) {
                history.push({ array: [...a], comparing: [j, min_idx], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, min_idx, j }, line: 2, variables: { i, min_idx, j }});
                history.push({ array: [...a], comparing: [j, min_idx], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, min_idx, j }, line: 3, variables: { i, min_idx, j }});
                if (a[j] < a[min_idx]) {
                    min_idx = j;
                    history.push({ array: [...a], comparing: [j, i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, min_idx, j }, line: 4, variables: { i, min_idx, j }});
                }
            }
            history.push({ array: [...a], comparing: [i, min_idx], swapping: [i, min_idx], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, min_idx }, line: 5, variables: { i, min_idx }});
            [a[i], a[min_idx]] = [a[min_idx], a[i]];
            history.push({ array: [...a], comparing: [], swapping: [i, min_idx], sorted: Array.from({length: i + 1}, (_, k) => k), pointers: { i, min_idx }, line: 5, variables: { i, min_idx }});
        }
        history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, k) => k), pointers: {}, line: -1 });
        return history;
    },
  },
  insertionSort: {
    name: "挿入ソート",
    pseudocode: [
        "for i from 1 to n-1:",
        "  key = arr[i]",
        "  j = i - 1",
        "  while j >= 0 and key < arr[j]:",
        "    arr[j+1] = arr[j]",
        "    j = j - 1",
        "  arr[j+1] = key",
    ],
    explanation: {
        description: "ソート済み部分に未ソートの要素を一つずつ正しい位置に挿入していきます。データがほぼソート済みの場合に高速です。",
        timeComplexity: "O(n²)",
        bestCase: "O(n)",
        spaceComplexity: "O(1)",
    },
    sort: (arr) => {
        const history = [];
        const n = arr.length;
        let a = [...arr];
        history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: -1, variables: {} });
        for (let i = 1; i < n; i++) {
            let key = a[i];
            let j = i - 1;
            history.push({ array: [...a], comparing: [i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i }, line: 0, variables: { i }});
            history.push({ array: [...a], comparing: [i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i }, line: 1, variables: { i, key }});
            history.push({ array: [...a], comparing: [i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, j }, line: 2, variables: { i, key, j }});
            while (j >= 0 && key < a[j]) {
                history.push({ array: [...a], comparing: [j, i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, j }, line: 3, variables: { i, key, j }});
                history.push({ array: [...a], comparing: [], swapping: [j, j+1], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, j }, line: 4, variables: { i, key, j }});
                a[j + 1] = a[j];
                j = j - 1;
                history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, j: j+1 }, line: 5, variables: { i, key, j: j+1 }});
                history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pointers: { i, j }, line: 3, variables: { i, key, j }});
            }
            history.push({ array: [...a], comparing: [], swapping: [j+1], sorted: Array.from({length: i+1}, (_, k) => k), pointers: { i, j }, line: 6, variables: { i, key, j }});
            a[j + 1] = key;
        }
        history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, k) => k), pointers: {}, line: -1, variables: {} });
        return history;
    },
  },
  shellSort: {
    name: "シェルソート",
    pseudocode: [
        "n = arr.length",
        "for gap = floor(n/2); gap > 0; gap = floor(gap/2):",
        "  for i = gap; i < n; i += 1:",
        "    temp = arr[i]",
        "    j = i",
        "    while j >= gap and arr[j - gap] > temp:",
        "      arr[j] = arr[j - gap]",
        "      j -= gap",
        "    arr[j] = temp",
    ],
    explanation: {
        description: "挿入ソートの改良版。一定間隔の要素群でソートを行い、徐々に間隔を狭めていくことで高速化を図ります。",
        timeComplexity: "O(n(log n)²) (平均)",
        bestCase: "O(n log n)",
        spaceComplexity: "O(1)",
    },
    sort: (arr) => {
        const history = [];
        const n = arr.length;
        let a = [...arr];
        history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: -1, variables: {} });
        history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: 0, variables: { n } });
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: 1, variables: { n, gap } });
            for (let i = gap; i < n; i += 1) {
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: { i }, line: 2, variables: { n, gap, i } });
                let temp = a[i];
                let j = i;
                history.push({ array: [...a], comparing: [i], swapping: [], sorted: [], pointers: { i, j }, line: 3, variables: { n, gap, i, temp } });
                history.push({ array: [...a], comparing: [i], swapping: [], sorted: [], pointers: { i, j }, line: 4, variables: { n, gap, i, temp, j } });
                while (j >= gap && a[j - gap] > temp) {
                    history.push({ array: [...a], comparing: [j - gap, i], swapping: [], sorted: [], pointers: { i, j }, line: 5, variables: { n, gap, i, temp, j } });
                    history.push({ array: [...a], comparing: [j - gap, i], swapping: [j, j - gap], sorted: [], pointers: { i, j }, line: 6, variables: { n, gap, i, temp, j } });
                    a[j] = a[j - gap];
                    history.push({ array: [...a], comparing: [], swapping: [j, j - gap], sorted: [], pointers: { i, j }, line: 6, variables: { n, gap, i, temp, j } });
                    j -= gap;
                    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: { i, j: j + gap, new_j: j }, line: 7, variables: { n, gap, i, temp, j: j + gap, new_j: j } });
                }
                history.push({ array: [...a], comparing: [], swapping: [j], sorted: [], pointers: { i, j }, line: 8, variables: { n, gap, i, temp, j } });
                a[j] = temp;
                history.push({ array: [...a], comparing: [], swapping: [j], sorted: [], pointers: { i, j }, line: 8, variables: { n, gap, i, temp, j } });
            }
        }
        history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, k) => k), pointers: {}, line: -1, variables: {} });
        return history;
    },
  },
  quickSort: {
    name: "クイックソート",
    pseudocode: [
        "quickSort(arr, low, high):",
        "  if low < high:",
        "    pi = partition(arr, low, high)",
        "    quickSort(arr, low, pi - 1)",
        "    quickSort(arr, pi + 1, high)",
        "",
        "partition(arr, low, high):",
        "  pivot = arr[high]",
        "  i = low - 1",
        "  for j from low to high - 1:",
        "    if arr[j] < pivot:",
        "      i++; swap(arr[i], arr[j])",
        "  swap(arr[i+1], arr[high])",
        "  return i + 1",
    ],
    explanation: {
        description: "基準値（ピボット）を基にデータを大小2つのグループに分け、それを再帰的に繰り返すことでソートします。一般的に非常に高速です。",
        timeComplexity: "O(n log n) (平均)",
        bestCase: "O(n log n)",
        spaceComplexity: "O(log n)",
    },
    sort: (arr) => {
        const history = [];
        let a = [...arr];
        function partition(low, high) {
            const pivot = a[high];
            let i = low - 1;
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {low, high}, partition: [low, high], pivot: high, line: 6, variables: { low, high } });
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {low, high}, partition: [low, high], pivot: high, line: 7, variables: { low, high, pivotVal: pivot } });
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {low, high, i}, partition: [low, high], pivot: high, line: 8, variables: { low, high, i } });
            for (let j = low; j < high; j++) {
                history.push({ array: [...a], comparing: [j, high], swapping: [], sorted: [], pointers: {low, high, i, j}, partition: [low, high], pivot: high, line: 9, variables: { low, high, i, j } });
                history.push({ array: [...a], comparing: [j, high], swapping: [], sorted: [], pointers: {low, high, i, j}, partition: [low, high], pivot: high, line: 10, variables: { low, high, i, j } });
                if (a[j] < pivot) {
                    i++;
                    history.push({ array: [...a], comparing: [j, high], swapping: [i, j], sorted: [], pointers: {low, high, i, j}, partition: [low, high], pivot: high, line: 11, variables: { low, high, i, j } });
                    [a[i], a[j]] = [a[j], a[i]];
                    history.push({ array: [...a], comparing: [], swapping: [i, j], sorted: [], pointers: {low, high, i, j}, partition: [low, high], pivot: high, line: 11, variables: { low, high, i, j } });
                }
            }
            history.push({ array: [...a], comparing: [], swapping: [i + 1, high], sorted: [], pointers: {low, high, i}, partition: [low, high], pivot: high, line: 12, variables: { low, high, i } });
            [a[i + 1], a[high]] = [a[high], a[i + 1]];
            history.push({ array: [...a], comparing: [], swapping: [i + 1, high], sorted: [i+1], pointers: {low, high, i}, partition: [low, high], pivot: high, line: 12, variables: { low, high, i } });
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [i+1], pointers: {low, high, i}, partition: [low, high], pivot: high, line: 13, variables: { low, high, i, returnVal: i+1 } });
            return i + 1;
        }
        function quickSortRec(low, high) {
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {low, high}, line: 0, variables: {low, high}});
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {low, high}, line: 1, variables: {low, high}});
            if (low < high) {
                const pi = partition(low, high);
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [pi], pointers: {low, high, pi}, line: 2, variables: { low, high, pi } });
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [pi], pointers: {low, high, pi}, line: 3, variables: { low, high, pi } });
                quickSortRec(low, pi - 1);
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [pi], pointers: {low, high, pi}, line: 4, variables: { low, high, pi } });
                quickSortRec(pi + 1, high);
            }
        }
        history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: -1 });
        quickSortRec(0, a.length - 1);
        history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: a.length}, (_, k) => k), pointers: {}, line: -1 });
        return history;
    },
  },
  mergeSort: {
    name: "マージソート",
    pseudocode: [
        "mergeSort(arr, l, r):",
        "  if l < r:",
        "    m = l + (r-l)/2",
        "    mergeSort(arr, l, m)",
        "    mergeSort(arr, m+1, r)",
        "    merge(arr, l, m, r)",
        "",
        "merge(arr, l, m, r):",
        "  Create L[...] and R[...]",
        "  Copy data to temp arrays L, R",
        "  i=0, j=0, k=l",
        "  while i < |L| and j < |R|:",
        "    if L[i] <= R[j]: arr[k++] = L[i++]",
        "    else: arr[k++] = R[j++]",
        "  Copy remaining elements",
    ],
    explanation: {
        description: "データを半分に分割し続け、ソート済みの小さな配列を併合（マージ）していく手法。どのようなデータでも安定した性能を発揮します。",
        timeComplexity: "O(n log n)",
        bestCase: "O(n log n)",
        spaceComplexity: "O(n)",
    },
    sort: (arr) => {
        const history = [];
        let a = [...arr];
        function merge(l, m, r) {
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l,m,r}, line: 7, mergeRange: [l, r] });
            const n1 = m - l + 1;
            const n2 = r - m;
            let L = new Array(n1);
            let R = new Array(n2);
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l,m,r}, line: 8, mergeRange: [l, r] });
            for (let i = 0; i < n1; i++) L[i] = a[l + i];
            for (let j = 0; j < n2; j++) R[j] = a[m + 1 + j];
            history.push({ array: [...a], comparing: Array.from({length: r-l+1}, (_, k) => l+k), swapping: [], sorted: [], pointers: {l,m,r}, line: 9, mergeRange: [l, r] });
            let i = 0, j = 0, k = l;
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {i, j, k}, line: 10, mergeRange: [l, r] });
            while (i < n1 && j < n2) {
                history.push({ array: [...a], comparing: [l+i, m+1+j], swapping: [], sorted: [], pointers: {i, j, k}, line: 11, mergeRange: [l, r] });
                if (L[i] <= R[j]) {
                    history.push({ array: [...a], comparing: [l+i, m+1+j], swapping: [], sorted: [], pointers: {i, j, k}, line: 12, mergeRange: [l, r] });
                    a[k] = L[i]; i++;
                } else {
                    history.push({ array: [...a], comparing: [l+i, m+1+j], swapping: [], sorted: [], pointers: {i, j, k}, line: 13, mergeRange: [l, r] });
                    a[k] = R[j]; j++;
                }
                history.push({ array: [...a], comparing: [], swapping: [k], sorted: [], pointers: {i, j, k}, line: 12, mergeRange: [l, r] });
                k++;
            }
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {i, j, k}, line: 14, mergeRange: [l, r] });
            while (i < n1) { a[k] = L[i]; history.push({ array: [...a], comparing: [], swapping: [k], sorted: [], pointers: {i, k}, line: 14, mergeRange: [l, r] }); i++; k++; }
            while (j < n2) { a[k] = R[j]; history.push({ array: [...a], comparing: [], swapping: [k], sorted: [], pointers: {j, k}, line: 14, mergeRange: [l, r] }); j++; k++; }
        }
        function mergeSortRec(l, r) {
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l, r}, line: 0 });
            history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l, r}, line: 1 });
            if (l < r) {
                const m = l + Math.floor((r - l) / 2);
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l,r,m}, line: 2 });
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l,r,m}, line: 3 });
                mergeSortRec(l, m);
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l,r,m}, line: 4 });
                mergeSortRec(m + 1, r);
                history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {l,r,m}, line: 5 });
                merge(l, m, r);
            }
        }
        history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pointers: {}, line: -1 });
        mergeSortRec(0, a.length - 1);
        history.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: a.length}, (_, k) => k), pointers: {}, line: -1 });
        return history;
    },
  },
};

// --- Reactコンポーネント ---

const POINTER_STYLES = {
  i: 'text-red-600', j: 'text-blue-600', min_idx: 'text-orange-500', key: 'text-lime-600',
  pivot: 'text-purple-600', pi: 'text-purple-600', low: 'text-gray-500', high: 'text-gray-500',
  gap: 'text-teal-500', temp: 'text-yellow-600', k: 'text-cyan-600', m: 'text-pink-600', default: 'text-gray-700'
};

const Bar = ({ value, state, maxValue }) => {
  const height = maxValue > 0 ? Math.max(5, (value / maxValue) * 100) : 5;
  const colorMap = {
    comparing: 'bg-yellow-400', swapping: 'bg-red-500', sorted: 'bg-green-500',
    pivot: 'bg-purple-500', default: 'bg-sky-400',
  };
  let baseClass = colorMap[state.base] || colorMap.default;
  return (<div className={`w-full ${baseClass} rounded-t-md`} style={{ height: `${height}%` }}/>);
};

const Visualizer = ({ array, currentFrame, arraySize }) => {
  const maxValueInArray = Math.max(...array, 1);
  const { comparing, swapping, sorted, pivot, pointers = {} } = currentFrame;
  const getState = (index) => {
    let state = { base: 'default' };
    if (swapping?.includes(index)) state.base = 'swapping';
    else if (pivot === index) state.base = 'pivot';
    else if (comparing?.includes(index)) state.base = 'comparing';
    else if (sorted?.includes(index)) state.base = 'sorted';
    return state;
  };

  return (
    <div className="flex-grow bg-white border-2 border-gray-200 rounded-lg p-4 flex justify-center space-x-1" style={{ minHeight: '500px' }}>
      {array.map((value, index) => {
        const activePointers = Object.keys(pointers).filter(key => pointers[key] === index);
        const height = maxValueInArray > 0 ? Math.max(5, (value / maxValueInArray) * 100) : 5;
        return (
            <div key={index} className="flex-1 flex flex-col items-center min-w-0">
                <div className="relative w-full flex-grow flex items-end">
                    <span
                        className={`absolute left-1/2 -translate-x-1/2 text-xs font-medium text-gray-800 ${arraySize > 40 ? 'opacity-0' : 'opacity-100'}`}
                        style={{ bottom: `calc(${height}% + 4px)`}}
                    >
                        {value}
                    </span>
                    <Bar value={value} state={getState(index)} maxValue={maxValueInArray}/>
                </div>
                <div className="w-full text-center text-xs font-semibold text-gray-500 mt-1 pt-1 h-6 flex items-center justify-center border-t-2 border-gray-400">
                    {index}
                </div>
                <div className="h-10 w-full flex flex-col items-center justify-start pt-1">
                    {activePointers.length > 0 && (
                        <>
                            <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                            <div className="flex flex-col items-center">
                                {activePointers.map(p => (<span key={p} className={`text-xs leading-tight font-bold ${POINTER_STYLES[p] || POINTER_STYLES.default}`}>{p}</span>))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
      })}
    </div>
  );
};

const RightPanel = ({ algorithm, currentFrame }) => {
    const [activeTab, setActiveTab] = useState('pseudocode');
    const { line, variables } = currentFrame;
    const { pseudocode, explanation } = ALGORITHMS[algorithm];

    return (
        <div className="w-full lg:w-1/3 bg-gray-800 text-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden" style={{maxHeight: 'calc(100vh - 100px)'}}>
            <div className="flex-shrink-0 flex border-b border-gray-600">
                <button
                    className={`flex-1 p-3 text-sm font-bold transition-colors duration-200 ${activeTab === 'pseudocode' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('pseudocode')}
                >
                    疑似コード
                </button>
                <button
                    className={`flex-1 p-3 text-sm font-bold transition-colors duration-200 ${activeTab === 'explanation' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('explanation')}
                >
                    アルゴリズム解説
                </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'pseudocode' && (
                    <div className="flex flex-col gap-4 h-full">
                        <div>
                            <h3 className="text-lg font-bold mb-2 text-white">疑似コード</h3>
                            <pre className='whitespace-pre-wrap font-mono text-sm'>
                                {pseudocode.map((lineText, index) => (
                                    <div key={index} className={`flex items-start rounded-md px-2 py-1 ${line === index ? 'bg-blue-500 bg-opacity-30' : ''}`}>
                                        <span className="w-6 text-gray-500 flex-shrink-0">{index + 1}</span>
                                        <span>{lineText}</span>
                                    </div>
                                ))}
                            </pre>
                        </div>
                        <div className="pt-2 border-t border-gray-600">
                            <h4 className="font-bold text-white mb-2">現在の変数の値:</h4>
                            <div className="flex flex-wrap gap-2 font-mono text-sm">
                                {variables && Object.keys(variables).length > 0 ? (
                                   Object.entries(variables).map(([key, value]) => (
                                       <span key={key} className="ml-2 px-2 py-0.5 bg-gray-700 rounded-md">
                                            <span className="text-orange-300">{key}</span><span className="text-gray-300">: </span><span className="text-green-300">{String(value)}</span>
                                       </span>
                                   ))
                                ) : (<span className="text-gray-500">N/A</span>)}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'explanation' && (
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-white">{ALGORITHMS[algorithm].name} 解説</h3>
                        <div className="text-sm space-y-3">
                            <p>{explanation.description}</p>
                            <div className='font-mono text-xs bg-gray-900 p-3 rounded-md space-y-1'>
                                <p><strong>平均計算量:</strong> {explanation.timeComplexity}</p>
                                <p><strong>最良計算量:</strong> {explanation.bestCase}</p>
                                <p><strong>空間計算量:</strong> {explanation.spaceComplexity}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6 bg-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p className="mb-2">
          Crafted by K. Agata &copy; 2025 | Assisted by Gemini
        </p>
        <a 
          href="https://github.com/agtkh/sort-visualizer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-sky-400 transition-colors"
        >
          <Github size={16} />
          <span>View Source Code</span>
        </a>
      </div>
    </footer>
  );
};


const App = () => {
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [arraySize, setArraySize] = useState(20);
  const [initialArray, setInitialArray] = useState(() => generateRandomArray(20));
  const [customInput, setCustomInput] = useState(initialArray.join(', '));
  const [inputError, setInputError] = useState('');
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [showInfo, setShowInfo] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const sortFunction = useMemo(() => ALGORITHMS[algorithm].sort, [algorithm]);

  useEffect(() => {
    const newHistory = sortFunction(initialArray);
    setHistory(newHistory);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [initialArray, sortFunction]);

  useEffect(() => {
    if (isPlaying && currentStep < history.length - 1) {
      const interval = 1000 / (speed * speed);
      const timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, interval);
      return () => clearTimeout(timer);
    } else if (currentStep >= history.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, history, speed]);
  
  const handleAlgorithmChange = (e) => { setIsPlaying(false); setAlgorithm(e.target.value); }
  const handleReset = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setInitialArray(newArray); setCustomInput(newArray.join(', ')); setInputError('');
  }, [arraySize]);
    
  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setArraySize(size);
    const newArray = generateRandomArray(size);
    setInitialArray(newArray); setCustomInput(newArray.join(', ')); setInputError('');
  };

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
    const nums = e.target.value.split(',').map(s => s.trim()).filter(Boolean).map(Number);
    if (nums.some(isNaN) || nums.some(n => n < 0 || n > 100)) { setInputError('0から100までの数値をカンマ区切りで入力してください。'); } 
    else { setInputError(''); }
  };

  const handleApplyCustomInput = () => {
    const nums = customInput.split(',').map(s => s.trim()).filter(Boolean).map(Number);
    if (nums.length > 0 && !nums.some(isNaN) && nums.every(n => n >= 0 && n <= 100)) {
        setInitialArray(nums); setArraySize(nums.length); setInputError('');
    } else { setInputError('無効な入力です。0から100までの数値をカンマ区切りで入力してください。'); }
  };

  const currentFrame = history[currentStep] || { array: initialArray, comparing: [], swapping: [], sorted: [], pointers: {} };
  const { array } = currentFrame;

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
            <header className="mb-4 text-center relative">
                <h2 className="text-4xl font-bold text-gray-800">ソートアルゴリズム可視化ツール</h2>
                <p className="text-gray-600 mt-2">様々なソートアルゴリズムの動作をインタラクティブに学ぼう</p>
                <div className='absolute top-0 right-0 flex gap-2'>
                    <button onClick={() => setShowControls(!showControls)} className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors shadow" title="コントロールパネルの表示切替">
                        {showControls ? <PanelTopClose/> : <PanelTopOpen/>}
                    </button>
                    <button onClick={() => setShowInfo(!showInfo)} className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors shadow" title="情報パネルの表示切替">
                        <SlidersHorizontal/>
                    </button>
                </div>
            </header>
            
            {showControls && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div className="flex flex-col"><label htmlFor="algorithm" className="text-sm font-medium text-gray-700 mb-1">アルゴリズム</label><select id="algorithm" value={algorithm} onChange={handleAlgorithmChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">{Object.keys(ALGORITHMS).map(key => (<option key={key} value={key}>{ALGORITHMS[key].name}</option>))}</select></div>
                        <div className="flex flex-col"><label htmlFor="size" className="text-sm font-medium text-gray-700 mb-1">要素数: {arraySize}</label><input type="range" id="size" min="5" max="100" value={arraySize} onChange={handleSizeChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /></div>
                        <div className="flex flex-col"><label htmlFor="speed" className="text-sm font-medium text-gray-700 mb-1">アニメーション速度</label><input type="range" id="speed" min="1" max="10" value={speed} onChange={e => setSpeed(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /></div>
                        <button onClick={handleReset} className="w-full flex items-center justify-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow"><RotateCcw className="w-4 h-4 mr-2" /><span>ランダム生成</span></button>
                    </div>
                    <div className="mt-4"><label htmlFor="custom-input" className="text-sm font-medium text-gray-700 mb-1">カスタム入力 (カンマ区切り)</label><div className="flex items-center gap-2"><input type="text" id="custom-input" value={customInput} onChange={handleCustomInputChange} className={`flex-grow p-2 border rounded-md shadow-sm ${inputError ? 'border-red-500' : 'border-gray-300'}`} placeholder="例: 5, 3, 8, 1"/><button onClick={handleApplyCustomInput} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow">適用</button></div>{inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}</div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow flex flex-col">
                    <Visualizer array={array} currentFrame={currentFrame} arraySize={array.length}/>
                    <div className="bg-white rounded-xl shadow-lg p-4 mt-6 flex justify-center items-center gap-4">
                        <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="p-3 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors"><SkipBack /></button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors text-2xl shadow-lg">{isPlaying ? <Pause /> : <Play />}</button>
                        <button onClick={() => setCurrentStep(prev => Math.min(history.length - 1, prev + 1))} disabled={!history.length || currentStep === history.length - 1} className="p-3 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors"><SkipForward /></button>
                    </div>
                    <div className="w-full max-w-xs mx-auto mt-2"><input type="range" min="0" max={history.length > 0 ? history.length - 1 : 0} value={currentStep} onChange={e => setCurrentStep(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /><div className="text-center text-sm text-gray-600 mt-1">ステップ: {currentStep} / {history.length > 0 ? history.length - 1 : 0}</div></div>
                </div>
                {showInfo && (<RightPanel algorithm={algorithm} currentFrame={currentFrame} />)}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
