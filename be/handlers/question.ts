export function getQuestion(call: any, callback: any) {
  callback(null, { id: call.request.id, title: "l1lhu1hu1さんについての質問です。", author: 'Jiro' });
}
