import { Thread } from 'chatgptdemo-api';

export default async function comment(code: string, thread: Thread) {
    const prompt =
        'write some comments embedded in each line for this code describing the function of each section. you should respond with the original code and comments about why the code its written that way either on top or next to it using the proper commenting syntax of the language. dont be too literal with the comments, if something looks obvious, like a return statement or a variable storing a constant, you dont need to comment it. your respond should be in a markdown code block, with the language the code is written in specified. do not provide any addtional information outside of the code block\n\n';

    return (
        (await thread.sendMessage(prompt + code)).match(
            /(?<=```[\s\S]*?\n)([\s\S]*?)(?=\n```)/g
        )?.[0] ?? code
    );
}
