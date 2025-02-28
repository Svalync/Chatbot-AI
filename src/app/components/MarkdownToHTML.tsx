import { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';

interface MarkdownToHTMLProps {
  content: string;
  showSubstring?: boolean;
}
export default function MarkdownToHTML(props: MarkdownToHTMLProps) {
  const [convertedHtml, setConvertedHtml] = useState<string>();
  useEffect(() => {
    const convertMarkdownToHTML = async () => {
      if (props.content) {
        const md = new MarkdownIt({
          html: true, // Enable HTML tags in Markdown
          breaks: true, // Convert newlines to <br>
          linkify: true, // Auto-detect URLs and convert to links
          typographer: true, // Enable smart quotes, ellipses, and dashes
        }).enable(['link', 'list', 'newline']);

        // Override the link rendering rule to add target="_blank"
        const defaultRender =
          md.renderer.rules.link_open ||
          function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
          };

        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
          // Add target="_blank" to all links
          tokens[idx].attrPush(['target', '_blank']);
          tokens[idx].attrPush(['rel', 'noopener noreferrer']); // For security

          return defaultRender(tokens, idx, options, env, self);
        };

        let data = '';

        if (props.showSubstring) {
          data = props.content.substring(0, 40).replace(/\n/g, '  <br>');
        } else {
          data = props.content.replace(/\n/g, '  <br>');
        }

        const markdownToHtml = md.render(data);

        setConvertedHtml(markdownToHtml);
      }
    };
    convertMarkdownToHTML();
  }, [props.content]);

  return convertedHtml ? <p dangerouslySetInnerHTML={{ __html: convertedHtml }}></p> : <></>;
}
