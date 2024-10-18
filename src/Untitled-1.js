
      // try {
      //   const linkPromises = uniqueLinks.map((link) => limit(async () => {
      //     try {
      //       const response = await limiter.schedule(() => axios.get(link));
      //       const $ = load(response.data);
      //       const name = $('#main_block h3').text() || null;
      //       return {
      //         name: name || null,
      //         isValid: !!name,
      //         link,
      //       };
      //     } catch (error) {
      //       console.error(`Failed to fetch link ${link}:`, error.message);
      //       return null;
      //     }
      //   }));

      //   const linkResponses = await Promise.allSettled(linkPromises);
      //   const validLinks = linkResponses
      //     .filter((r) => r.status === 'fulfilled' && r.value)
      //     .map((r) => r.value);

      //   console.log(validLinks);
      // } catch (error) {
      //   console.error('Error fetching WhatsApp links:', error);
      // }