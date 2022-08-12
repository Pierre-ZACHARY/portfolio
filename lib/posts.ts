import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import {VFile} from "vfile";

const postsDirectory = path.join(process.cwd(), '/pages/posts/markdown' );

export async function getSortedPostsData(locale: string = "fr") {
    // Get file names under /posts
    const fileNames = fs.readdirSync(path.join(postsDirectory, locale));
    let allPostsData = [];
    for(let fileName of fileNames) {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(path.join(postsDirectory, locale), fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        const processedDescription = await remark()
            .use(html)
            .process(matterResult.data.description);
        const descriptionHtml = processedDescription.toString();
        allPostsData.push({
            id,
            lastupdated: false,
            descriptionHtml: descriptionHtml,
            ...matterResult.data,
        });
    }
    // Sort posts by date
    allPostsData = allPostsData.sort(({ date: a }: any, { date: b }: any) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
    allPostsData[0].lastupdated = true;
    return allPostsData;
}

export function getAllPostIds(locale: string = "fr") {
    const fileNames = fs.readdirSync(path.join(postsDirectory, locale));

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            }
        };
    });
}

export async function getPostData(id: string, locale: string = "fr") {
    const fullPath = path.join(postsDirectory, locale, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    const regXHeader = /(?<flag>#{1,6})\s+(?<content>.+)/g
    const titles = Array
            .from(
                matterResult.content.matchAll(regXHeader)
            )
            .map((value: RegExpMatchArray, index ) => ({
                heading: `h${ value.groups!.flag.length }`,
                content: value.groups!.content,
            }))


    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        titles,
        ...matterResult.data,
    };
}