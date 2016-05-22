using BundleTransformer.Core.Builders;
using BundleTransformer.Core.Bundles;
using BundleTransformer.Core.Orderers;
using BundleTransformer.Core.Transformers;
using System.Web;
using System.Web.Optimization;

namespace ValidadorAutomato
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //This setting is used when if you have specfied the path Using System.web.Optimization.bundle.Cdnpath then it will try to fetch data from there first
            bundles.UseCdn = true;
            //NullBuilder class is responsible for prevention of early applying of the item transformations and combining of code.
            var nullBuilder = new NullBuilder();
            //StyleTransformer and ScriptTransformer classes produce processing of stylesheets and scripts.
            var styleTransformer = new StyleTransformer();

            var scriptTransformer = new ScriptTransformer();
            //NullOrderer class disables the built-in sorting mechanism and save assets sorted in the order they are declared.
            var nullOrderer = new NullOrderer();

            var scriptsToBundle = new Bundle("~/bundles/js").IncludeDirectory("~/Scripts/Custom", "*.js");

            scriptsToBundle.Builder = nullBuilder;
            scriptsToBundle.Transforms.Add(scriptTransformer);
            scriptsToBundle.Orderer = nullOrderer;

            bundles.Add(scriptsToBundle);

            var stylesToBundle = new StyleBundle("~/bundles/css").IncludeDirectory("~/Content/", "*.css");

            stylesToBundle.Orderer = nullOrderer;

            bundles.Add(stylesToBundle);
        }
    }
}
