import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface StyleCategory {
  id: string;
  name: string;
  image: string;
}

const StyleBannerComponent = () => {
  const styleCategories: StyleCategory[] = [
    {
      id: "casual",
      name: "Casual",
      image:
        "https://s3-alpha-sig.figma.com/img/e1b7/74ab/a32d9a769caba77c08e107a9198dcd6d?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IlJcaa0QU~VbPZwPnOhO~G5xZZwsYCfM~rg5KLf-xKUubCQ08C5Nq0~KjRQkc8opb7qFfdrfh7utdhbmV2EQGTKkW0ldzHlE3V4qhZQWZxVrtDffTsE9Jgc5Q~5kOvgFpjXub~AFkMKOUGDJLT-FHcLQq~ij7EikWtNdOq8ksk5XM8xCq4GmVA3pREmMpbYllfmBv~0ViVAS~-vv~u8uxu02wRBIe6goWsDF4nkFNHggU9hIIrmEjgzPzCYYJ3AbQZhfa1GNwHpIGfnsnRdJDUQ54~4In0UlFHrs0nr7Oy9vC0E4jh-j0mPYV2ks11nbeIznbFjwAzcQhbVUgD6pTw__",
    },
    {
      id: "formal",
      name: "Formal",
      image:
        "https://s3-alpha-sig.figma.com/img/e46e/d6ac/8bdbe2c750dcc6e834bf1d98a4a73b29?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QOYEpbI8W5DJrq5g~BGnaIJieVbO70RhXV3Z-vB-qsB4N5tH7i9d3JYaAYfqdSG-ORH3GfLhyr0MVu0ONgY0Upp5kzzwO67UbkotTKzKRuG~HQIjJDfJixFBQSxVxZ4TgObXKxKE6j9rHQbUgQkjotzgD-yE0dKjjjUlkvGGXiGjfXVbjETD6EZXkcAtzxZfEM4-7EOXpAXmtb8KDTvb0lCEz8nAbZSe8rhlAY8rJRnPf8YvRQrrMsQ0dPOFJiXegnW-utemYOkzzX5GPQny6jx8fUBwh48i5RFIeTEdsE8KO80mBjAtFTHEhQEAxrRAPsOUIAFPwOtX90kuTSeFnw__",
    },
    {
      id: "party",
      name: "Party",
      image:
        "https://s3-alpha-sig.figma.com/img/aa19/c69e/82cd85a823c989c1c8631bd976e2cbfb?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ewsloFG4FQX0g-IZ4PEOOIHMv1bZpUeKa5uzgEyYzEtkeDC0hZBvZZKW1Rz4ToGiip-T6sQb9Birx3ARAp7FQsF-zkXxmuZH2~Vfn-e4It3QJ0Dj93Gi9lky-Wp2OZjQ-eAk-AFYBCIf7dyXGhbuOzOHT5jbd2Q9kBT3g1qKNpoS4G0wyqWUECrpGEbszqubbYjF2YxVNY~EjyR8MfyXpBYXmb6yJqPYg-tbfOUs6TdfLVaCVtIXMKhJZjGTtcNfBuFcoS3UOGiQZIk01xamGidH~fN2w0CTsEDV8JLRa6OM2UPD2W8-v0qAYobMLRA83WPZ1I7Xffe7k2GbCrCy6A__",
    },
    {
      id: "gym",
      name: "Gym",
      image:
        "https://s3-alpha-sig.figma.com/img/fce6/58e0/c17a220fe8bfb1126626f3ab58a761ec?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=feXYNoIZr6SSQoxgtj50VGJpBxNKWWIMYjoCRxREPRH83xdDxJZ7UEO3dCIy3qgnZHMr7x3lnUieolBHWEu8LNHfJyMb37lTPySQbWqS71pHa4j5VoW7-CBvCNfXkQD2N1B5UKxdgEpTUfJ8jIqN58E6tSXzQihc2F~Q1QGpg6MNT5e6jQUJGJ6Fboy-w0SX~fFNpBZShOi6lIyoac0sfRsYg-OVApnvnYu77Yqb6d6hqzxa3oc8ruzmsMheLDxeVJGB-V839gWh1sSd7XcCqBmYEoGosT2M9grQAl3-i4ODUL3jbJRMYQ29BoDoIlDyygB05ZEHT657QjnSllYqEg__",
    },
  ];

  return (
    <div className={cx("style-banner-container")}>
      <h2 className={cx("style-banner-heading")}>BROWSE BY DRESS STYLE</h2>

      <div className={cx("style-banner-grid")}>
        {styleCategories.map((category) => (
          <div key={category.id} className={cx("category-card")}>
            <div className={cx("category-content")}>
              <h3 className={cx("category-name")}>{category.name}</h3>
              <div className={cx("image-container")}>
                <img
                  src={category.image}
                  alt={`${category.name} style`}
                  className={cx("category-image")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleBannerComponent;
