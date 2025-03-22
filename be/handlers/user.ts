export function getUser(call: any, callback: any) {
  callback(null, { id: call.request.id, name: "Taro", age: 40 });
}
